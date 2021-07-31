import { dim } from "ansi-colors";
import root from "app-root-path";

import { Constants } from "../../config";
import { LoggingService } from "../../logger";
import { createStorageSource, time, wait } from "../../utils";
import { ConfigMissingError } from "../../errors";

import {
  validateExportCredentials,
  getPathProtocol,
  validatePathProtocol,
  createImportChildProcesses,
} from "../../tasks";

import type {
  ImportOptions,
  GlobalOptions,
  ToParentMessage,
  CollectionSnapshotMessage,
  KillMessage,
} from "../../types";

/**
 * Import Firestore data.
 *
 * @param path The path to import the data from.
 * @param options The import action options.
 */
export async function importAction(
  path: string,
  options: ImportOptions & GlobalOptions
) {
  const logger = LoggingService.create("import", options);
  logger.debug("Import configuration", { path, options, root });

  if (!options.project)
    throw new ConfigMissingError(
      "Project is required.",
      `Please specify a Firebase project id using the --project or -P option, or provide it through a configuration file.`
    );

  const protocol = getPathProtocol(path);
  validatePathProtocol(protocol);
  validateExportCredentials(options);

  const source = createStorageSource(path);
  const existingCollections = await source.listCollections();
  let rootCollections = options.collections ?? existingCollections;

  // If collections are specified, check if there are corresponding
  // JSON files in the storage source
  if (options.collections) {
    const existingCollectionJSON = new Set(
      existingCollections
        .filter((x) => x.endsWith(".json"))
        .map((x) => x.replace(/\.json$/, ""))
    );

    // Convert any collection references that match a JSON file to have
    // a .json extension so that we know to use a JSONArrayReadStream.
    // Otherwise, ensure it has a .snapshot extension.
    rootCollections = rootCollections.map((collection) =>
      existingCollectionJSON.has(collection)
        ? `${collection}.json`
        : `${collection}.snapshot`
    );
  }

  logger.info(
    `Starting import task for ${rootCollections.length} path(s)`,
    rootCollections
  );

  //
  // CONCURRENT PROCESSING USING CHILD PROCESSES
  //
  // Responsibility of parent:
  //  - read list of collection snapshot files to import
  //  - distribute collections to child processes for processing
  //
  // Responsibility of child:
  //  - receive a collection snapshot path
  //  - write data from collection snapshot to Firestore
  //

  const errors: string[] = [];
  const collectionPaths = [...rootCollections];
  const pendingPaths = new Set<string>();

  const children = createImportChildProcesses(
    Math.min(options.concurrency, rootCollections.length),
    { path, options },
    logger
  );

  // Listen for messages from child process
  children.forEach(({ process }) => {
    process.on("message", (message: ToParentMessage) => {
      switch (message.type) {
        case "path-complete":
          pendingPaths.delete(message.path);
          break;
        case "fatal-error":
          errors.push(message.message);
          break;
      }
    });
  });

  let childIndex = 0;

  do {
    const path = collectionPaths.pop();

    if (!path) {
      // If we don't have a path, wait before we continue and try again
      await wait(Constants.WAIT_TIME);
      continue;
    }

    let size = 0;

    const { duration } = await time(async () => {
      pendingPaths.add(path);

      // Send collection to a child for processing
      children[childIndex].process.send({
        type: "collection-snapshot",
        path,
      } as CollectionSnapshotMessage);

      childIndex = (childIndex + 1) % children.length;
    });

    if (size > 0)
      logger.info(
        `Start processing ${size} document(s) from collection ${path} ${dim(
          duration.timeString
        )}`
      );
  } while (pendingPaths.size > 0 && errors.length === 0);

  // Clean up all child processes
  await Promise.all(
    children.map(async ({ process, terminated }) => {
      process.send({ type: "kill" } as KillMessage);
      await terminated;
    })
  );

  if (errors.length) {
    logger.error(
      `Import task for ${rootCollections.length} path(s) terminated with errors`
    );
  } else {
    logger.info(
      `Finished import task for ${rootCollections.length} path(s)`,
      rootCollections
    );
  }
}

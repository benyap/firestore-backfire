import { dim } from "ansi-colors";
import root from "app-root-path";

import { Constants } from "../../config";
import { time, wait } from "../../utils";
import { LoggingService } from "../../logger";
import { IncorrectConfigError, UnsupportedOutputProtocolError } from "../../errors";

import { createStorageSource } from "../../storage";
import {
  getPathProtocol,
  validatePathProtocol,
  createImportChildProcesses,
  ensureRequiredProtocolOptions,
  ensureFirestoreCredentials,
  createFirestoreCredentials,
  createFirestore,
} from "../../tasks";

import type {
  ImportActionOptions,
  GlobalOptions,
  ToParentMessage,
  CollectionSnapshotMessage,
  KillMessage,
} from "../../types";

/**
 * Import Firestore data.
 *
 * @param path The path to import data from.
 * @param options The import action options.
 */
export async function importAction(
  path: string,
  options: ImportActionOptions & GlobalOptions
) {
  const logger = LoggingService.create("import", options);
  logger.debug("Import configuration", { path, options, root: root.toString() });

  if (!options.project)
    throw new IncorrectConfigError(
      "Project is required.",
      `Please specify a Firebase project id using the --project or -P option, or provide it through a configuration file.`
    );

  // Connect to Firestore
  ensureFirestoreCredentials(options);
  const credentials = createFirestoreCredentials(options);
  createFirestore(options.project, credentials);
  logger.info(`Connected to Firestore for "${options.project}"`);

  // Check the storage protocol being used
  const { protocol, path: pathOnly } = getPathProtocol(path, options.json);
  if (!validatePathProtocol(protocol))
    throw new UnsupportedOutputProtocolError(protocol);

  ensureRequiredProtocolOptions(protocol, options, logger);

  // Connect to storage source
  const source = createStorageSource(protocol, pathOnly, options);
  await source.connect();

  // Get import paths
  const rootPaths = await source.listImportPaths(options.collections);
  logger.info(`Starting import task for ${rootPaths.length} path(s)`, rootPaths);

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
  const collectionPaths = [...rootPaths];
  const pendingPaths = new Set<string>();

  const children = createImportChildProcesses(
    Math.min(options.concurrency ?? Constants.MAX_CONCURRENCY, rootPaths.length),
    { protocol, path: pathOnly, options },
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
      `Import task for ${rootPaths.length} path(s) terminated with errors`
    );
  } else {
    logger.info(`Finished import task for ${rootPaths.length} path(s)`, rootPaths);
  }
}

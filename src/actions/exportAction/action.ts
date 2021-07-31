import { dim } from "ansi-colors";
import root from "app-root-path";

import { Constants } from "../../config";
import { LoggingService } from "../../logger";
import { stringToRegex, time, wait } from "../../utils";
import { ConfigMissingError } from "../../errors";

import {
  validateExportCredentials,
  getPathProtocol,
  validatePathProtocol,
  createCredentials,
  createFirestore,
  clearLocalOutputDirectory,
  createExportChildProcesses,
} from "../../tasks";

import type {
  DocumentMessage,
  ExportOptions,
  GlobalOptions,
  KillMessage,
  ToParentMessage,
} from "../../types";

/**
 * Export Firestore data.
 *
 * @param path The path to export the data to.
 * @param options The export action options.
 */
export async function exportAction(
  path: string,
  options: ExportOptions & GlobalOptions
) {
  const logger = LoggingService.create("export", options);
  logger.debug("Export configuration", { path, options, root });

  if (!options.project)
    throw new ConfigMissingError(
      "Project is required.",
      `Please specify a Firebase project id using the --project or -P option, or provide it through a configuration file.`
    );

  const protocol = getPathProtocol(path);
  validatePathProtocol(protocol);
  validateExportCredentials(options);

  if (protocol !== "file" && options.json)
    logger.warn(
      `The --json flag has no effect when using the ${protocol}:// output protocol.`
    );

  // Clear output directory if it using local file output
  if (protocol === "file") {
    const removed = clearLocalOutputDirectory(path);
    if (removed) logger.debug(`Cleared local directory: ${path}`);
  }

  // Connect to Firestore
  const credentials = createCredentials(options);
  const firestore = createFirestore(options.project, credentials);
  logger.info(`Connected to Firestore for "${options.project}"`);

  const rootCollections =
    options.collections ?? (await firestore.listCollections()).map((c) => c.id);
  const patterns = (options.patterns ?? []).map((string) => stringToRegex(string));

  logger.info(
    `Starting export task for ${rootCollections.length} path(s)`,
    rootCollections
  );

  //
  // CONCURRENT PROCESSING USING CHILD PROCESSES
  //
  // Responsibility of parent:
  //  - receive a list of collection / subcollection paths
  //  - fetch documents in collection path
  //  - distribute documents to child processes for processing
  //
  // Responsibility of child:
  //  - receive a document path and document data
  //  - write document data to the output path
  //  - return any subocllections in that document to the parent
  //

  const errors: string[] = [];
  const collectionPaths = [...rootCollections];
  const pendingPaths = new Set<string>();

  const children = createExportChildProcesses(
    Math.min(options.concurrency, rootCollections.length),
    { path, options },
    logger
  );

  // Listen for messages from child process
  children.forEach(({ process }) => {
    process.on("message", (message: ToParentMessage) => {
      switch (message.type) {
        case "collection-path":
          collectionPaths.push(message.path);
          break;
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
      // Check path depth
      const parts = path.split("/");
      const pathDepth = (parts.length - 1) / 2;
      if (pathDepth > options.depth) {
        logger.debug(
          `Skipping path ${path} (exceeds max subcollection depth of ${options.depth})`
        );
        return;
      }

      // Read documents from collection
      const snapshot = await firestore.collection(path).get();
      size = snapshot.size;

      // Distribute documents between child processes
      snapshot.forEach((doc) => {
        if (patterns.length > 0) {
          // Check if path matches any patterns
          const matched = patterns.some((regex) => regex.test(doc.ref.path));
          if (!matched) {
            logger.debug(`Skipping document ${doc.ref.path} (not matched)`);
            size -= 1;
            return;
          }
        }

        pendingPaths.add(doc.ref.path);

        children[childIndex].process.send({
          type: "document",
          id: doc.id,
          root: doc.ref.parent.path.split("/")[0],
          path: doc.ref.path,
          data: doc.data(),
        } as DocumentMessage);

        childIndex = (childIndex + 1) % children.length;
      });
    });

    if (size > 0)
      logger.info(
        `Start processing ${size} document(s) from collection ${path} ${dim(
          duration.timeString
        )}`
      );
  } while (
    (pendingPaths.size > 0 || collectionPaths.length > 0) &&
    errors.length === 0
  );

  // Clean up all child processes
  await Promise.all(
    children.map(async ({ process, terminated }) => {
      process.send({ type: "kill" } as KillMessage);
      await terminated;
    })
  );

  if (errors.length) {
    logger.error(
      `Export task for ${rootCollections.length} path(s) terminated with errors`
    );
  } else {
    logger.info(
      `Finished export task for ${rootCollections.length} path(s)`,
      rootCollections
    );
  }
}

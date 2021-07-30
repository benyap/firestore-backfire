import { ChildProcess } from "child_process";

import { LoggingService } from "../../logger";
import { forkChild, stringToRegex, time, wait } from "../../utils";

import {
  validateExportCredentials,
  getOutuptProtocol,
  validateOutputProtocol,
  createCredentials,
  createFirestore,
  clearLocalOutputDirectory,
} from "../../tasks";

import type {
  ExportOptionsMessage,
  DocumentMessage,
  ExportOptions,
  GlobalOptions,
  KillMessage,
  ToParentMessage,
} from "../../types";

/**
 * Export Firestore data.
 *
 * @param project The id of the Firebase project.
 * @param options The export action options.
 * @param globalOptions Global program options.
 */
export async function exportAction(
  project: string,
  options: ExportOptions,
  globalOptions: GlobalOptions
) {
  const logger = LoggingService.create("export", globalOptions);

  const protocol = getOutuptProtocol(options.out);
  validateOutputProtocol(protocol);
  validateExportCredentials(project, options);

  if (protocol !== "file" && options.json)
    logger.warn(
      `The --json flag has no effect when using the ${protocol}:// output protocol.`
    );

  // Clear output directory if it using local file output
  if (protocol === "file") {
    const removed = clearLocalOutputDirectory(options.out);
    if (removed) logger.debug(`Cleared local directory: ${options.out}`);
  }

  // Connect to Firestore
  const credentials = createCredentials(options);
  const firestore = createFirestore(project, credentials);
  logger.info(`Connected to Firestore for "${project}"`);

  const rootCollections =
    options.collections ?? (await firestore.listCollections()).map((c) => c.id);
  const patterns = (options.patterns ?? []).map((string) => stringToRegex(string));

  logger.info(
    `Starting back up task for ${rootCollections.length} path(s)`,
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

  const children: {
    identifier: string | number;
    process: ChildProcess;
    terminated: Promise<any>;
  }[] = [];

  const errors: string[] = [];

  // Create child processes
  for (let i = 0; i < options.concurrency; i++) {
    const identifier = i + 1;

    // Spawn process
    const { process, terminated } = forkChild<ExportOptionsMessage>(
      identifier,
      "actions/exportAction/subprocess",
      logger,
      { type: "config-export", identifier, project, options }
    );

    children.push({ identifier, process, terminated });

    // Listen for messages from child process
    process.on("message", (message: ToParentMessage) => {
      switch (message.type) {
        case "path":
          collectionPaths.push(message.path);
          break;
        case "document-complete":
          pendingPaths.delete(message.path);
          break;
        case "fatal-error":
          errors.push(message.message);
          break;
      }
    });
  }

  const WAIT_TIME = 500;
  const collectionPaths = [...rootCollections];
  const pendingPaths = new Set<string>();

  let childIndex = 0;

  do {
    const path = collectionPaths.pop();

    if (!path) {
      // If we don't have a path, wait before we continue and try again
      await wait(WAIT_TIME);
      continue;
    }

    let size = 0;

    const { duration } = await time(async () => {
      // Check path depth
      const parts = path.split("/");
      const pathDepth = (parts.length - 1) / 2;
      if (pathDepth > options.depth) {
        logger.debug(
          `Skipping path ${path} (exceeds max depth of ${options.depth})`
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
          const desiredPath = patterns.some((regex) => regex.test(doc.ref.path));
          if (!desiredPath) {
            logger.debug(`Skipping document ${doc.ref.path} (not matched)`);
            size -= 1;
            return;
          }
        }

        const child = children[childIndex];
        pendingPaths.add(doc.ref.path);
        child.process.send({
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
        `Start processing ${size} document(s) from collection ${path} (${duration.timeString})`
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
      `Back up task for ${rootCollections.length} path(s) terminated with errors`
    );
  } else {
    logger.info(
      `Finished back up task for ${rootCollections.length} path(s)`,
      rootCollections
    );
  }
}

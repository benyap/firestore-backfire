import type { firestore as Firestore } from "firebase-admin";
import { ChildProcess } from "child_process";

import { forkChild, stringToRegex, time, wait } from "../utils";
import { LoggingService } from "../logger";
import { LogLevel } from "../types";

import type {
  Config,
  DocumentMessage,
  ConfigMessage,
  KillMessage,
  ToParentMessage,
} from "../types";

/**
 * Back up Firestore documents as specified by the program configuration.
 *
 * @param firestore The Firestore instance.
 * @param config The program configuration.
 */
export async function runBackup(
  firestore: ReturnType<typeof Firestore>,
  config: Config
) {
  const logger = LoggingService.create(
    "tasks.runBackup",
    config.verbose
      ? [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
      : undefined
  );

  const rootCollections =
    config.collections ?? (await firestore.listCollections()).map((c) => c.id);
  const patterns = (config.patterns ?? []).map((string) => stringToRegex(string));

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
  for (let i = 0; i < config.concurrency; i++) {
    const identifier = i + 1;

    // Spawn process
    const { process, terminated } = forkChild<ConfigMessage>(
      identifier,
      "tasks/runBackupProcess",
      logger,
      { type: "config", identifier, config }
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

  let run = true;
  let childIndex = 0;

  while (run && errors.length === 0) {
    const path = collectionPaths.pop();

    if (!path) {
      // We should be done if there are no more pending paths
      run = pendingPaths.size > 0;

      // Wait a little before we continue
      await wait(WAIT_TIME);
      continue;
    }

    let size = 0;

    const { duration } = await time(async () => {
      // Check path depth
      const parts = path.split("/");
      const pathDepth = (parts.length - 1) / 2;
      if (pathDepth > config.depth) {
        logger.debug(`Skipping path ${path} (exceeds max depth of ${config.depth})`);
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
  }

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

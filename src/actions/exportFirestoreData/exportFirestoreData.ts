import root from "app-root-path";
import { bold, cyan, yellow } from "ansi-colors";

import {
  Logger,
  Timer,
  ToWorkerMessenger,
  GroupedSet,
  delay,
  redactFields,
  padNumberStart,
  styledCount,
} from "~/utils";
import { FirestoreService, StorageSourceFactory } from "~/services";
import { UnknownStorageSourceTypeError } from "~/errors";

import { ExportFirestoreDataOptions } from "./types";
import { ExportMessageToParent, ExportMessageToWorker } from "./messages";
import { createExportWorkerPool } from "./worker";

/**
 * Export documents from Firestore.
 */
export async function exportFirestoreData(options: ExportFirestoreDataOptions) {
  const { logLevel, project, paths = [] } = options;

  const logger = Logger.create(exportFirestoreData.name, logLevel);
  const messenger = new ToWorkerMessenger<ExportMessageToWorker>();

  if (options.type === "unknown") throw new UnknownStorageSourceTypeError("unknown");

  // Hide sensitive details when logging options
  const redactedOptions = redactFields(
    options,
    "credentials",
    "awsAccessKeyId",
    "awsSecretAccessKey"
  );
  logger.debug("Export configuration", {
    root: root.toString(),
    ...redactedOptions,
  });

  const timer = Timer.start();

  // Connect to Firestore
  const { firestore } = await FirestoreService.create(options);
  logger.info(`Connected to Firestore for project ${bold(options.project)}`);

  // Connect to storage source
  const source = await StorageSourceFactory.create(options);
  logger.info(`Connected to ${bold(source.name)} storage source`);

  // Create a pool of worker threads
  const pool = await createExportWorkerPool(options);
  logger.debug(`Created ${yellow(String(pool.size()))} worker threads`);

  // Track paths that are being explored
  const pendingPaths = new GroupedSet<string>();
  const pendingDocumentPaths = new GroupedSet<string>();
  const earlyExit: (ExportMessageToParent & { type: "notify-early-exit" })[] = [];

  // Set up listeners for messages from workers
  pool.onMessage((message: ExportMessageToParent) => {
    switch (message.type) {
      case "notify-explore-path-finish":
        pendingPaths.remove(message.identifier, message.path);
        logger.verbose(`Finished exploring path ${cyan(message.path)}`);
        break;
      case "do-explore-document-subcollections":
        pendingDocumentPaths.add(message.identifier, message.path);
        break;
      case "notify-safe-exit":
        logger.debug(`Worker ${bold(padNumberStart(message.identifier, 2))} done`);
        break;
      case "notify-early-exit":
        earlyExit.push(message);
        pendingPaths.removeGroup(message.identifier);
        pendingDocumentPaths.removeGroup(message.identifier);
        break;
    }
  });

  function queuePathForProcessing(path: string) {
    const [worker, id] = pool.next();
    pendingPaths.add(id, path);
    messenger.send(worker, {
      type: "do-explore-path",
      path,
    });
  }

  if (paths.length === 0) {
    // Get root collections and send them to workers for processing
    const collections = await firestore.listCollections();
    collections.forEach((collection) => {
      queuePathForProcessing(collection.path);
    });
  } else {
    // Otherwise, only process the specified paths
    paths.forEach((path) => {
      queuePathForProcessing(path);
    });
  }

  while (
    (pendingPaths.size() > 0 || pendingDocumentPaths.size() > 0) &&
    earlyExit.length < pool.size()
  ) {
    // Get pending documents in batches of 100
    const paths = pendingDocumentPaths.popFromAny(100);

    // If there are no pending document paths, it means
    // workers are still processing paths
    if (paths.length === 0) {
      await delay(1000);
      continue;
    }

    await Promise.all(
      paths.map(async (path) => {
        const collections = await firestore.doc(path).listCollections();
        collections.forEach((collection) => {
          // Send any subcollections to workers to explore
          queuePathForProcessing(collection.path);
        });
      })
    );
  }

  if (earlyExit.length > 0) {
    logger.warn(`${earlyExit.length} worker thread(s) exited early`);
  }

  const remaining = pool.size() - earlyExit.length;
  if (remaining > 0)
    logger.debug(`Closing ${styledCount(yellow, remaining, "write stream")}`);

  pool.broadcast(messenger.createMessage({ type: "close-stream-and-exit" }));
  await pool.done();

  timer.stop();
  logger.success(
    `Finished exporting data from ${bold(project)} (took ${timer.durationString})`
  );
}

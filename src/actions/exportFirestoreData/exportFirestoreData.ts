import root from "app-root-path";
import { bold, green } from "ansi-colors";

import { Logger, Timer, ToWorkerMessenger, delay, redactFields } from "~/utils";
import { FirestoreService, StorageSourceFactory } from "~/services";

import { ExportFirestoreDataOptions } from "./types";
import { ExportMessageToParent, ExportMessageToWorker } from "./messages";
import { createExportWorkerPool } from "./worker";

/**
 * Export documents from Firestore.
 */
export async function exportFirestoreData(options: ExportFirestoreDataOptions) {
  const { logLevel, project, collections: filterCollections } = options;

  const logger = Logger.create(exportFirestoreData.name, logLevel);
  const messenger = new ToWorkerMessenger<ExportMessageToWorker>();

  // Hide sensitive details when logging options
  const redactedOptions = redactFields(options, "credentials");
  logger.debug("Export configuration", {
    root: root.toString(),
    ...redactedOptions,
  });

  const timer = Timer.start();

  // Connect to Firestore
  const { firestore } = await FirestoreService.create(options);
  logger.info(`Connected to Firestore for project ${options.project}`);

  // Connect to storage source
  const source = await StorageSourceFactory.create(options);
  logger.info(`Connected to ${source.name} storage source`);

  // Create a pool of worker threads
  const pool = await createExportWorkerPool(options);
  logger.debug(`Created ${pool.size()} worker threads`);

  // Track paths that are being explored
  const pendingCollectionPaths: Set<string> = new Set();
  const pendingDocumentPaths: string[] = [];
  const earlyExit: (ExportMessageToParent & { type: "notify-early-exit" })[] = [];

  // Set up listeners for messages from workers
  pool.onMessage((message: ExportMessageToParent) => {
    switch (message.type) {
      case "notify-explore-collection-finish":
        pendingCollectionPaths.delete(message.path);
        logger.debug(`Finished exploring collection path ${green(message.path)}`);
        break;
      case "do-explore-document-subcollections":
        pendingDocumentPaths.push(message.path);
        break;
      case "notify-early-exit":
        earlyExit.push(message);
        break;
    }
  });

  // Get root collections and send them to workers for processing
  let rootCollections = await firestore.listCollections();
  if (filterCollections) {
    const filter = new Set(filterCollections);
    rootCollections = rootCollections.filter((c) => filter.has(c.id));
  }

  rootCollections.forEach((collection) => {
    pendingCollectionPaths.add(collection.path);
    pool.next().postMessage(
      messenger.createMessage({
        type: "do-explore-collection",
        path: collection.path,
      })
    );
  });

  while (
    (pendingCollectionPaths.size > 0 || pendingDocumentPaths.length > 0) &&
    earlyExit.length < pool.size()
  ) {
    // Get pending documents in batches of 100
    const paths = pendingDocumentPaths.splice(0, 100);

    // If there are no pending document paths, it means
    // workers are still searching through collections
    if (paths.length === 0) {
      await delay(500);
      continue;
    }

    await Promise.all(
      paths.map(async (path) => {
        const collections = await firestore.doc(path).listCollections();
        collections.forEach((collection) => {
          // Send any subcollections to workers to explore
          pendingCollectionPaths.add(collection.path);
          messenger.send(pool.next(), {
            type: "do-explore-collection",
            path: collection.path,
          });
        });
      })
    );
  }

  if (earlyExit.length > 0) {
    logger.warn(`${earlyExit.length} worker thread(s) exited early`);
  }

  pool.broadcast(messenger.createMessage({ type: "close-stream-and-exit" }));

  timer.stop();
  logger.success(
    `Finished exporting data from ${bold(project)} (took ${timer.durationString})`
  );
}

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
  const { logLevel, project, collections: filterCollections } = options;

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
  const pendingCollectionPaths = new GroupedSet<string>();
  const pendingDocumentPaths = new GroupedSet<string>();
  const earlyExit: (ExportMessageToParent & { type: "notify-early-exit" })[] = [];

  // Set up listeners for messages from workers
  pool.onMessage((message: ExportMessageToParent) => {
    switch (message.type) {
      case "notify-explore-collection-finish":
        pendingCollectionPaths.remove(message.identifier, message.path);
        logger.verbose(`Finished exploring collection path ${cyan(message.path)}`);
        break;
      case "do-explore-document-subcollections":
        pendingDocumentPaths.add(message.identifier, message.path);
        break;
      case "notify-safe-exit":
        logger.debug(`Worker ${bold(padNumberStart(message.identifier, 2))} done`);
        break;
      case "notify-early-exit":
        earlyExit.push(message);
        pendingDocumentPaths.removeGroup(message.identifier);
        pendingCollectionPaths.removeGroup(message.identifier);
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
    const [worker, id] = pool.next();
    pendingCollectionPaths.add(id, collection.path);
    messenger.send(worker, {
      type: "do-explore-collection",
      path: collection.path,
    });
  });

  while (
    (pendingCollectionPaths.size() > 0 || pendingDocumentPaths.size() > 0) &&
    earlyExit.length < pool.size()
  ) {
    // Get pending documents in batches of 100
    const paths = pendingDocumentPaths.popFromAny(100);

    // If there are no pending document paths, it means
    // workers are still searching through collections
    if (paths.length === 0) {
      await delay(1000);
      continue;
    }

    await Promise.all(
      paths.map(async (path) => {
        const collections = await firestore.doc(path).listCollections();
        collections.forEach((collection) => {
          // Send any subcollections to workers to explore
          const [worker, id] = pool.next();
          pendingCollectionPaths.add(id, collection.path);
          messenger.send(worker, {
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

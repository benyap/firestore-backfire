import { isMainThread, parentPort, workerData } from "worker_threads";
import { bold, green, yellow } from "ansi-colors";

import {
  Logger,
  WorkerPool,
  ToParentMessenger,
  delay,
  getCPUCount,
  padNumberStart,
  splitIntoBatches,
  collectionPathDepth,
  styledCount,
} from "~/utils";
import { FirestoreService, StorageSourceFactory } from "~/services";

import { ExportFirestoreDataOptions } from "./types";
import { ExportMessageToParent, ExportMessageToWorker } from "./messages";

export async function createExportWorkerPool(
  options: ExportFirestoreDataOptions
): Promise<WorkerPool<ExportMessageToParent>> {
  const { concurrency = getCPUCount() } = options;
  const pool = new WorkerPool<ExportMessageToParent>(concurrency, __filename);
  pool.createWorkers(options);
  await pool.ready();
  return pool;
}

async function worker() {
  const options = workerData as ExportFirestoreDataOptions & { identifier: string };
  const { identifier, path, depth = Infinity, patterns = [] } = options;
  const id = padNumberStart(parseInt(identifier), 2);

  const logger = Logger.create(`${worker.name}-${id}`, options.logLevel);
  const messenger = new ToParentMessenger<
    ExportMessageToParent,
    ExportMessageToWorker
  >(parentPort);

  try {
    // Connect to data sources
    const { firestore } = await FirestoreService.create(options);
    const source = await StorageSourceFactory.create(options);
    const stream = await source.openWriteStream(`${path}/chunk${id}.json`);

    // Keep track of collections to explore from parent
    const collectionPathsToExplore: string[] = [];

    // Listen to messages from the parent
    messenger.onMessage(async (message) => {
      switch (message.type) {
        case "do-explore-collection":
          collectionPathsToExplore.push(message.path);
          break;
        case "close-stream-and-exit":
          await stream.close();
          process.exit();
      }
    });

    // Explore each collection and write the data to the storage source
    const run = true;
    while (run) {
      const collectionPath = collectionPathsToExplore.pop();

      if (!collectionPath) {
        await delay(500);
        continue;
      }

      const collectionString = green(collectionPath);
      logger.debug(`Exploring collection path ${collectionString}`);
      messenger.send({
        type: "notify-explore-collection-start",
        path: collectionPath,
        from: identifier,
      });

      const allDocuments = await firestore
        .collection(collectionPath)
        .listDocuments();
      const filteredDocuments: typeof allDocuments = [];

      for (const document of allDocuments) {
        const { path } = document;
        if (patterns.some((p) => p.test(path))) {
          filteredDocuments.push(document);
        } else {
          logger.verbose(`Skipping document ${bold(path)} (no pattern match)`);
        }
      }

      // Get document data
      const batches = splitIntoBatches(filteredDocuments, 100);
      for (const batch of batches) {
        const snapshots = await firestore.getAll(...batch);
        await Promise.all(
          snapshots.map((snapshot) => {
            logger.verbose(`Exporting document ${bold(snapshot.ref.path)}`);
            stream.write({
              path: snapshot.ref.path,
              data: snapshot.data(),
            });
          })
        );
      }

      const docCount = filteredDocuments.length;
      const docCountString = styledCount(yellow, docCount, "document");
      logger.info(`Exported ${docCountString} from ${collectionString}`);

      // Notify parent of sub collections if it doesn't exceed the depth
      if (collectionPathDepth(collectionPath) >= depth) {
        logger.verbose(
          `Skipping paths inside ${bold(collectionPath)} (exceeds depth of ${depth})`
        );
      } else {
        for (const document of allDocuments) {
          messenger.send({
            type: "do-explore-document-subcollections",
            path: document.path,
            from: identifier,
          });
        }
      }

      // Notify parent that the collection is done
      messenger.send({
        type: "notify-explore-collection-finish",
        path: collectionPath,
        from: identifier,
      });
    }
  } catch (error: any) {
    logger.error(`Exiting due to error ${error.message}`);
    messenger.send({
      type: "notify-early-exit",
      from: identifier,
      reason: error,
    });
    process.exit(1);
  }
}

if (!isMainThread) worker();

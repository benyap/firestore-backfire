import { isMainThread, parentPort, workerData } from "worker_threads";
import { cyan, green, yellow } from "ansi-colors";

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
  options: Exclude<ExportFirestoreDataOptions, { type: "unknown" }>
): Promise<WorkerPool<ExportMessageToParent>> {
  const { workers = getCPUCount() } = options;
  const pool = new WorkerPool<ExportMessageToParent>(workers, __filename);
  pool.createWorkers(options);
  await pool.ready();
  return pool;
}

type WorkerOptions = Exclude<ExportFirestoreDataOptions, { type: "unknown" }>;

async function worker() {
  const options = workerData as WorkerOptions & { identifier: string };
  const { identifier, path, depth = Infinity, patterns, prettify, force } = options;
  const id = padNumberStart(parseInt(identifier), 2);

  const logger = Logger.create(`${worker.name}-${id}`, options.logLevel);
  const messenger = new ToParentMessenger<
    ExportMessageToParent,
    ExportMessageToWorker
  >(parentPort);

  // Keep track of collections to explore from parent
  let currentPath: string | undefined = undefined;
  const collectionPathsToExplore: string[] = [];

  try {
    // Connect to data sources
    const { firestore } = await FirestoreService.create(options);
    const source = await StorageSourceFactory.create(options);
    const streamPath = `${path}/chunk${id}.json`;
    const { stream, overwritten } = await source.openWriteStream(streamPath, force);

    logger.verbose(
      `Opened write stream to ${green(streamPath)}${
        overwritten ? ` (overwritten)` : ""
      }`
    );

    // Listen to messages from the parent
    messenger.onMessage(async (message) => {
      switch (message.type) {
        case "do-explore-collection":
          collectionPathsToExplore.push(message.path);
          break;
        case "close-stream-and-exit":
          await stream.close();
          messenger.send({ type: "notify-safe-exit", identifier });
          process.exit();
      }
    });

    // Explore each collection and write the data to the storage source
    const run = true;
    while (run) {
      currentPath = collectionPathsToExplore.pop();

      if (!currentPath) {
        await delay(500);
        continue;
      }

      const collectionString = cyan(currentPath);
      logger.debug(`Exploring collection path ${collectionString}`);
      messenger.send({
        type: "notify-explore-collection-start",
        identifier,
        path: currentPath,
      });

      const allDocuments = await firestore.collection(currentPath).listDocuments();
      const filteredDocuments: typeof allDocuments = [];

      for (const document of allDocuments) {
        const { path } = document;
        if (!patterns || patterns.some((p) => p.test(path))) {
          filteredDocuments.push(document);
        } else {
          logger.verbose(`Skipping document ${cyan(path)} (no pattern match)`);
        }
      }

      // Get document data
      const batches = splitIntoBatches(filteredDocuments, 100);
      for (const batch of batches) {
        const snapshots = await firestore.getAll(...batch);
        await Promise.all(
          snapshots.map((snapshot) => {
            logger.verbose(`Exporting document ${cyan(snapshot.ref.path)}`);
            stream.write(
              {
                path: snapshot.ref.path,
                data: snapshot.data(),
              },
              prettify ? 2 : 0
            );
          })
        );
      }

      const docCount = filteredDocuments.length;
      const docCountString = styledCount(yellow, docCount, "document");
      logger.info(`Exported ${docCountString} from ${collectionString}`);

      // Notify parent of sub collections if it doesn't exceed the depth
      if (collectionPathDepth(currentPath) >= depth) {
        logger.verbose(
          `Skipping paths inside ${collectionString} (exceeds depth of ${depth})`
        );
      } else {
        for (const document of allDocuments) {
          messenger.send({
            type: "do-explore-document-subcollections",
            identifier,
            path: document.path,
          });
        }
      }

      // Notify parent that the collection is done
      messenger.send({
        type: "notify-explore-collection-finish",
        identifier,
        path: currentPath,
      });
    }
  } catch (error: any) {
    logger.error(`Exiting due to error ${error.message}`);
    messenger.send({
      type: "notify-early-exit",
      identifier,
      reason: error,
      currentPath,
      pendingPaths: collectionPathsToExplore,
    });
    process.exit(1);
  }
}

if (!isMainThread) worker();

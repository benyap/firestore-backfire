import { isMainThread, parentPort, workerData } from "worker_threads";
import { DocumentReference } from "@google-cloud/firestore";
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
  documentPathDepth,
  styledCount,
  pathType,
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
  const pathsToExplore: string[] = [];

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
        case "do-explore-path":
          pathsToExplore.push(message.path);
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
      currentPath = pathsToExplore.pop();

      if (!currentPath) {
        await delay(500);
        continue;
      }

      const type = pathType(currentPath);
      const pathString = cyan(currentPath);

      const documentsToExport: DocumentReference[] = [];

      if (type === "document") {
        logger.verbose(`Received path to document ${pathString}`);
        documentsToExport.push(firestore.doc(currentPath));
      } else if (type === "collection") {
        logger.debug(`Exploring collection path ${pathString}`);
        messenger.send({
          type: "notify-explore-path-start",
          identifier,
          path: currentPath,
        });
        const documents = await firestore.collection(currentPath).listDocuments();
        const countString = styledCount(yellow, documents.length, "document");
        logger.verbose(`Found ${countString} in ${pathString}`);
        documents.forEach((ref) => documentsToExport.push(ref));
      }

      let docCount = 0;
      const batches = splitIntoBatches(documentsToExport, 100);

      // Get document data
      for (const batch of batches) {
        // Filter out any documents that don't match specified patterns
        const documentsToFetch = batch.filter((ref) => {
          // Always fetch if no patterns are specified
          const fetch =
            !patterns ||
            patterns.length === 0 ||
            patterns.some((p) => p.test(ref.path));

          if (!fetch)
            logger.verbose(`Skipping document ${cyan(ref.path)} (no pattern match)`);

          return fetch;
        });

        if (documentsToFetch.length === 0) continue;

        const snapshots = await firestore.getAll(...documentsToFetch);
        await Promise.all(
          snapshots.map((snapshot) => {
            const pathString = cyan(snapshot.ref.path);
            if (!snapshot.exists) {
              logger.error(`Document not found ${pathString}`);
              return;
            }
            logger.verbose(`Exporting document ${pathString}`);
            stream.write(
              {
                path: snapshot.ref.path,
                data: snapshot.data() ?? null,
              },
              prettify ? 2 : 0
            );
            docCount++;
          })
        );
      }

      const docCountString = styledCount(yellow, docCount, "document");
      logger.info(`Exported ${docCountString} from ${pathString}`);

      // Notify parent of subcollections if path doesn't exceed depth
      if (
        (type === "collection" && collectionPathDepth(currentPath) >= depth) ||
        (type === "document" && documentPathDepth(currentPath) >= depth)
      ) {
        logger.verbose(
          `Skipping paths inside ${pathString} (exceeds depth of ${depth})`
        );
      } else {
        for (const document of documentsToExport) {
          messenger.send({
            type: "do-explore-document-subcollections",
            identifier,
            path: document.path,
          });
        }
      }

      // Notify parent that the path is done
      messenger.send({
        type: "notify-explore-path-finish",
        identifier,
        path: currentPath,
      });
    }
  } catch (error: any) {
    logger.error(`Exiting due to error: ${error.message}`);
    messenger.send({
      type: "notify-early-exit",
      identifier,
      reason: error,
      currentPath,
      pendingPaths: pathsToExplore,
    });
    process.exit(1);
  }
}

if (!isMainThread) worker();

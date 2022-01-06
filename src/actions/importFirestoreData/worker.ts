import { isMainThread, parentPort, workerData } from "worker_threads";
import { bold, yellow } from "ansi-colors";

import { DeserializedFirestoreDocument } from "~/types";
import {
  delay,
  documentPathDepth,
  getCPUCount,
  Logger,
  padNumberStart,
  styledCount,
  Timer,
  ToParentMessenger,
  WorkerPool,
} from "~/utils";
import {
  FirestoreService,
  IReadStream,
  IStorageSourceService,
  StorageSourceFactory,
} from "~/services";

import { ImportFirestoreDataOptions } from "./types";
import { ImportMessageToParent, ImportMessageToWorker } from "./messages";

export async function createImportWorkerPoool(
  options: ImportFirestoreDataOptions,
  storageSource: IStorageSourceService
): Promise<WorkerPool<ImportMessageToParent>> {
  const objects = await storageSource.listObjects(options.path);
  const preferredWorkerCount = objects.length > 0 ? objects.length : getCPUCount();
  const { concurrency = preferredWorkerCount } = options;
  const pool = new WorkerPool<ImportMessageToParent>(concurrency, __filename);
  pool.createWorkers(options);
  await pool.ready();
  return pool;
}

async function worker() {
  const options = workerData as ImportFirestoreDataOptions & { identifier: string };
  const {
    identifier,
    depth = Infinity,
    collections = [],
    patterns = [],
    merge,
    overwrite,
  } = options;
  const id = padNumberStart(parseInt(identifier), 2);

  const logger = Logger.create(`${worker.name}-${id}`, options.logLevel);
  const messenger = new ToParentMessenger<
    ImportMessageToParent,
    ImportMessageToWorker
  >(parentPort);

  try {
    // Connect to data sources
    const { firestore } = await FirestoreService.create(options);
    const source = await StorageSourceFactory.create(options);

    // Keep track of paths to read from the parent
    const pathsToImport: string[] = [];

    let stream: IReadStream | null = null;

    // Listen to messages from the parent
    messenger.onMessage(async (message) => {
      switch (message.type) {
        case "do-import-object":
          pathsToImport.push(message.path);
          break;
        case "close-stream-and-exit":
          await stream?.close();
          process.exit();
      }
    });

    // Read and import data from each storage object
    const run = true;
    while (run) {
      const path = pathsToImport.pop();

      if (!path) {
        await delay(500);
        continue;
      }

      stream = await source.openReadStream(path, firestore);
      logger.debug(`Importing documents from ${path}`);
      messenger.send({
        type: "notify-import-object-start",
        path,
        from: identifier,
      });

      let documents: DeserializedFirestoreDocument[] | null;
      let docCount = 0;

      const writer = firestore.bulkWriter();

      while ((documents = await stream.read()) !== null) {
        documents.forEach((doc) => {
          const { path } = doc;

          if (
            collections.length > 0 &&
            !collections.some((c) => path.startsWith(c))
          ) {
            logger.verbose(
              `Skipping document ${bold(path)} (collection not specified)`
            );
            return;
          }

          if (documentPathDepth(path) > depth) {
            logger.verbose(
              `Skipping document ${bold(path)} (exceeds depth of ${depth})`
            );
            return;
          }

          if (!patterns.some((p) => p.test(path))) {
            logger.verbose(`Skipping document ${bold(path)} (no pattern match)`);
            return;
          }

          logger.verbose(`Importing document ${bold(doc.path)}`);
          docCount += 1;

          if (overwrite || merge)
            writer.set(firestore.doc(doc.path), doc.data, { merge });
          else writer.create(firestore.doc(doc.path), doc.data);
        });
      }

      // Flush writes and close the stream
      const timer = Timer.start();
      await Promise.all([writer.flush(), stream.close()]);
      timer.stop();

      const docCountString = styledCount(yellow, docCount, "document");
      logger.info(
        `Imported ${docCountString} from ${path} (took ${timer.durationString})`
      );

      // Notify parent that object has been imported
      messenger.send({
        type: "notify-import-object-finish",
        path,
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

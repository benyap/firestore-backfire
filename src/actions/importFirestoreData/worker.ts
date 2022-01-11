import { isMainThread, parentPort, workerData } from "worker_threads";
import { BulkWriterError } from "@google-cloud/firestore";
import { cyan, green, yellow } from "ansi-colors";

import { DeserializedFirestoreDocument } from "~/types";
import {
  delay,
  documentPathDepth,
  getCPUCount,
  Logger,
  padNumberStart,
  plural,
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
  options: Exclude<ImportFirestoreDataOptions, { type: "unknown" }>,
  storageSource: IStorageSourceService
): Promise<WorkerPool<ImportMessageToParent>> {
  const objects = await storageSource.listObjects(options.path);
  const preferredWorkerCount = objects.length > 0 ? objects.length : getCPUCount();
  const { workers = preferredWorkerCount } = options;
  const pool = new WorkerPool<ImportMessageToParent>(workers, __filename);
  pool.createWorkers(options);
  await pool.ready();
  return pool;
}

type WorkerOptions = Exclude<ImportFirestoreDataOptions, { type: "unknown" }>;

async function worker() {
  const options = workerData as WorkerOptions & { identifier: string };
  const {
    identifier,
    depth = Infinity,
    paths = [],
    patterns,
    mode: writerMode = "create-and-skip-existing",
  } = options;
  const id = padNumberStart(parseInt(identifier), 2);

  const logger = Logger.create(`${worker.name}-${id}`, options.logLevel);
  const messenger = new ToParentMessenger<
    ImportMessageToParent,
    ImportMessageToWorker
  >(parentPort);

  // Keep track of paths to read from the parent
  let currentPath: string | undefined = undefined;
  const pathsToImport: string[] = [];

  try {
    // Connect to data sources
    const { firestore } = await FirestoreService.create(options);
    const source = await StorageSourceFactory.create(options);

    let stream: IReadStream | null = null;

    // Listen to messages from the parent
    messenger.onMessage(async (message) => {
      switch (message.type) {
        case "do-import-object":
          pathsToImport.push(message.path);
          break;
        case "exit":
          messenger.send({
            type: "notify-safe-exit",
            identifier,
          });
          process.exit();
      }
    });

    // Read and import data from each storage object
    const run = true;
    while (run) {
      currentPath = pathsToImport.pop();

      if (!currentPath) {
        await delay(500);
        continue;
      }

      stream = await source.openReadStream(currentPath, firestore);
      logger.debug(`Importing documents from ${green(currentPath)}`);
      messenger.send({
        type: "notify-import-object-start",
        path: currentPath,
        identifier,
      });

      const writer = firestore.bulkWriter();
      const errors: BulkWriterError[] = [];
      const documentsToImport: DeserializedFirestoreDocument[] = [];

      await stream.readFromStream((documents) => {
        for (const document of documents) {
          if (paths.length > 0 && !paths.some((c) => document.path.startsWith(c))) {
            logger.verbose(
              `Skipping document ${cyan(document.path)} (no matching path specified)`
            );
            continue;
          }

          if (documentPathDepth(document.path) > depth) {
            logger.verbose(
              `Skipping document ${cyan(document.path)} (exceeds depth of ${depth})`
            );
            continue;
          }

          if (patterns && !patterns.some((p) => p.test(document.path))) {
            logger.verbose(
              `Skipping document ${cyan(document.path)} (no pattern match)`
            );
            continue;
          }

          documentsToImport.push(document);
        }
      });

      const timer = Timer.start();

      await Promise.all(
        documentsToImport.map(async ({ path, data }) => {
          logger.verbose(`Importing document ${cyan(path)}`);
          switch (writerMode) {
            case "create":
            case "create-and-skip-existing":
              writer
                .create(firestore.doc(path), data)
                .catch((error) => errors.push(error));
              break;
            case "merge":
              writer
                .set(firestore.doc(path), data, { merge: true })
                .catch((error) => errors.push(error));
              break;
            case "overwrite":
              writer
                .set(firestore.doc(path), data)
                .catch((error) => errors.push(error));
              break;
          }
        })
      );

      await writer.flush();
      timer.stop();

      const docCount = documentsToImport.length;
      const errorCount = errors.length;
      const successCount = docCount - errorCount;

      let countString = styledCount(yellow, docCount, "document");
      if (errorCount > 0) {
        countString = `${yellow(String(successCount))}/${yellow(
          String(docCount)
        )} ${plural(successCount, "document")}`;
      }

      logger.info(
        `Imported ${countString} from ${green(currentPath)} (took ${
          timer.durationString
        })`
      );

      errors.forEach(({ code, documentRef, message }) => {
        const path = cyan(documentRef.path);
        switch (code) {
          case 6:
            if (writerMode === "create-and-skip-existing") {
              logger.debug(`Skipped creating document ${path} as it already exists`);
            } else {
              logger.error(
                `Failed to create document at ${path} as it already exists`
              );
            }
            break;
          default:
            logger.error(`Error code ${code}: ${message}`);
            break;
        }
      });

      // Notify parent that object has been imported
      messenger.send({
        type: "notify-import-object-finish",
        path: currentPath,
        identifier,
      });
    }
  } catch (error: any) {
    logger.error(`Exiting due to error: ${error.message}`);
    messenger.send({
      type: "notify-early-exit",
      identifier,
      reason: error,
      currentPath,
      pendingPaths: pathsToImport,
    });
    process.exit(1);
  }
}

if (!isMainThread) worker();

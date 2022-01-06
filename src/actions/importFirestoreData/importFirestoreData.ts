import root from "app-root-path";
import { bold, green } from "ansi-colors";

import {
  delay,
  distributeEvenlyBySize,
  Logger,
  redactFields,
  Timer,
  ToWorkerMessenger,
} from "~/utils";
import { ConfigurationError } from "~/errors";
import { FirestoreService, StorageSourceFactory } from "~/services";

import { ImportFirestoreDataOptions } from "./types";
import { ImportMessageToParent, ImportMessageToWorker } from "./messages";
import { createImportWorkerPoool } from "./worker";

export async function importFirestoreData(options: ImportFirestoreDataOptions) {
  const { logLevel, project } = options;

  const logger = Logger.create(importFirestoreData.name, logLevel);
  const messenger = new ToWorkerMessenger<ImportMessageToWorker>();

  // Hide sensitive details when logging options
  const redactedOptions = redactFields(options, "credentials");
  logger.debug("Export configuration", {
    root: root.toString(),
    ...redactedOptions,
  });

  const timer = Timer.start();

  // Validate options
  const { merge, overwrite } = options;
  if (merge && overwrite) {
    throw new ConfigurationError(
      "the merge and overwrite options cannot both be true"
    );
  }

  // Connect to Firestore
  await FirestoreService.create(options);
  logger.info(`Connected to Firestore for project ${options.project}`);

  // Connect to storage source
  const source = await StorageSourceFactory.create(options);
  logger.info(`Connected to ${source.name} storage source`);

  // Create a pool of worker threads
  const pool = await createImportWorkerPoool(options, source);
  logger.debug(`Created ${pool.size()} worker threads`);

  // Distribute files evenly to workers based on file size
  const objects = await source.listObjects(options.path);
  const buckets = distributeEvenlyBySize(objects, pool.size());

  // Keep track of objects still being processed
  const pendingObjects = new Set(objects.map((object) => object.path));
  const earlyExit: (ImportMessageToParent & { type: "notify-early-exit" })[] = [];

  // Set up listeners for messages from workers
  pool.onMessage((message) => {
    switch (message.type) {
      case "notify-import-object-finish":
        pendingObjects.delete(message.path);
        logger.debug(`Finished importing from ${green(message.path)}`);
        break;
      case "notify-early-exit":
        earlyExit.push(message);
        break;
    }
  });

  // Pass objects to each worker
  buckets.forEach((bucket) => {
    bucket.forEach((object) => {
      messenger.send(pool.next(), {
        type: "do-import-object",
        path: object.path,
      });
    });
  });

  // Wait until all workers are done
  while (pendingObjects.size > 0 && earlyExit.length !== pool.size()) {
    await delay(1000);
  }

  pool.broadcast(messenger.createMessage({ type: "close-stream-and-exit" }));

  if (earlyExit.length > 0) {
    logger.warn(`${earlyExit.length} worker thread(s) exited early`);
  }

  timer.stop();
  logger.success(
    `Finished importing data into Firestore from ${bold(project)} (took ${
      timer.durationString
    })`
  );
}

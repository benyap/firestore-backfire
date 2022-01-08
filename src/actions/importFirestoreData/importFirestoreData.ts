import root from "app-root-path";
import { bold, green, yellow } from "ansi-colors";

import {
  delay,
  distributeEvenlyBySize,
  GroupedSet,
  Logger,
  padNumberStart,
  redactFields,
  styledCount,
  Timer,
  ToWorkerMessenger,
} from "~/utils";
import { UnknownStorageSourceTypeError } from "~/errors";
import { FirestoreService, StorageSourceFactory } from "~/services";

import { ImportFirestoreDataOptions } from "./types";
import { ImportMessageToParent, ImportMessageToWorker } from "./messages";
import { createImportWorkerPoool } from "./worker";

export async function importFirestoreData(options: ImportFirestoreDataOptions) {
  const { logLevel, project } = options;

  const logger = Logger.create(importFirestoreData.name, logLevel);
  const messenger = new ToWorkerMessenger<ImportMessageToWorker>();

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
  await FirestoreService.create(options);
  logger.info(`Connected to Firestore for project ${bold(options.project)}`);

  // Connect to storage source
  const source = await StorageSourceFactory.create(options);
  logger.info(`Connected to ${bold(source.name)} storage source`);

  // Create a pool of worker threads
  const pool = await createImportWorkerPoool(options, source);
  logger.debug(`Created ${yellow(String(pool.size()))} worker threads`);

  // Distribute files evenly to workers based on file size
  const objects = await source.listObjects(options.path);
  const buckets = distributeEvenlyBySize(objects, pool.size());

  // Keep track of objects still being processed
  const pendingObjects = new GroupedSet<string>();
  const earlyExit: (ImportMessageToParent & { type: "notify-early-exit" })[] = [];

  // Set up listeners for messages from workers
  pool.onMessage((message) => {
    switch (message.type) {
      case "notify-import-object-finish":
        pendingObjects.remove(message.identifier, message.path);
        logger.verbose(`Finished importing from ${green(message.path)}`);
        break;
      case "notify-safe-exit":
        logger.debug(`Worker ${bold(padNumberStart(message.identifier, 2))} done`);
        break;
      case "notify-early-exit":
        pendingObjects.removeGroup(message.identifier);
        earlyExit.push(message);
        break;
    }
  });

  // Pass objects to each worker
  buckets.forEach((bucket) => {
    bucket.forEach((object) => {
      const [worker, id] = pool.next();
      pendingObjects.add(id, object.path);
      messenger.send(worker, {
        type: "do-import-object",
        path: object.path,
      });
    });
  });

  // Wait until all workers are done
  while (pendingObjects.size() > 0 && earlyExit.length !== pool.size()) {
    await delay(1000);
  }

  if (earlyExit.length > 0) {
    logger.warn(`${earlyExit.length} worker thread(s) exited early`);
  }

  logger.debug(
    `Closing ${styledCount(yellow, pool.size() - earlyExit.length, "read stream")}`
  );
  pool.broadcast(messenger.createMessage({ type: "exit" }));
  await pool.done();

  timer.stop();
  logger.success(
    `Finished importing data into ${bold(project)} (took ${timer.durationString})`
  );
}

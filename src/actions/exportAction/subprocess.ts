import { dim } from "ansi-colors";

import { Constants } from "../../config";
import { log, time, wait, createStorageSource } from "../../utils";
import { createCredentials, createFirestore } from "../../tasks";
import { LogLevel } from "../../types";

import type {
  ToChildMessage,
  CollectionPathMessage,
  DocumentMessage,
  PathCompleteMessage,
  IWriteStreamHandler,
  ExportOptions,
  FatalErrorMessage,
} from "../../types";

/* ======================================================

    This file is forked from `action.ts` to write the
    data of document snapshots to the output stream, then
    notify the parent of any subcollections that the
    document has.

 * ====================================================== */

const documents: DocumentMessage[] = [];

let started = false;
let run = false;

// React to messages from the parent process
process.on("message", (message: ToChildMessage) => {
  switch (message.type) {
    // Start the main loop when we receive a config
    case "config-export":
      if (started) break;
      started = true;
      run = true;
      main(message.identifier, message.path, message.options);
      break;

    // Add documents to process
    case "document":
      documents.push(message);
      break;

    // Start the termination process
    case "kill":
      run = false;
      break;
  }
});

async function main(
  identifier: string | number,
  path: string,
  options: ExportOptions
) {
  // Create Firestore instance
  const credentials = createCredentials(options);
  const firestore = createFirestore(options.project, credentials);

  // Mapping of write streams
  const streams: Record<string, IWriteStreamHandler> = {};

  try {
    while (run) {
      const document = documents.pop();

      if (!document) {
        await wait(Constants.WAIT_TIME);
        continue;
      }

      const { duration } = await time(async () => {
        // Create write stream if it doesn't exist
        if (!(document.root in streams)) {
          const source = createStorageSource(path, options);
          streams[document.root] = await source.openWriteStream(document.root);
          log(LogLevel.DEBUG, `Opened write stream to ${document.root}`);
        }

        // Stream data to output
        const stream = streams[document.root];
        await stream.write(document);

        // Get subcollections and send them to parent
        const subcollections = await firestore.doc(document.path).listCollections();
        if (subcollections.length > 0) {
          subcollections.forEach(({ path }) => {
            process.send?.({
              type: "collection-path",
              path,
            } as CollectionPathMessage);
          });
        }
      });

      log(
        LogLevel.DEBUG,
        `Document path ${document.path} complete ${dim(duration.timeString)}`
      );

      // Signal the completion of the document to the parent
      process.send?.({
        type: "path-complete",
        path: document.path,
      } as PathCompleteMessage);
    }

    // Close streams
    await Promise.all(
      Object.keys(streams).map(async (key) => {
        const stream = streams[key];
        await stream.close();
        log(LogLevel.DEBUG, `Closed write stream ${stream.path}`);
      })
    );
  } catch (error) {
    log(LogLevel.ERROR, error.message);
    process.send?.({
      type: "fatal-error",
      message: error.message,
    } as FatalErrorMessage);
  }

  log(LogLevel.DEBUG, `Child process ${identifier} (${process.pid}) exited`);
  process.exit(0);
}

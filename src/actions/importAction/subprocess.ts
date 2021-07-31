import { dim } from "ansi-colors";

import { Constants } from "../../config";
import { log, time, wait, createStorageSource, stringToRegex } from "../../utils";
import { createCredentials, createFirestore } from "../../tasks";
import { LogLevel } from "../../types";

import type {
  ImportOptions,
  ToChildMessage,
  PathCompleteMessage,
  FatalErrorMessage,
  DeserializedFirestoreDocument,
} from "../../types";

/* ======================================================

    This file is forked from `action.ts` to read the data
    from a collection snapshot file, then write the data
    to Firestore.

 * ====================================================== */

const paths: string[] = [];

let started = false;
let run = false;

// React to messages from the parent process
process.on("message", (message: ToChildMessage) => {
  switch (message.type) {
    // Start the main loop when we receive a config
    case "config-import":
      if (started) break;
      started = true;
      run = true;
      main(message.identifier, message.path, message.options);
      break;

    // Add documents to process
    case "collection-snapshot":
      paths.push(message.path);
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
  options: ImportOptions
) {
  // Create Firestore instance
  const credentials = createCredentials(options);
  const firestore = createFirestore(options.project, credentials);

  // Generate patterns
  const patterns = (options.patterns ?? []).map((string) => stringToRegex(string));

  try {
    while (run) {
      const collection = paths.pop();

      if (!collection) {
        await wait(Constants.WAIT_TIME);
        continue;
      }

      const { duration } = await time(async () => {
        // Create read stream
        const source = createStorageSource(path, {
          json: collection.endsWith(".json"),
        });
        const stream = await source.openReadStream(collection);
        log(LogLevel.DEBUG, `Opened read stream to ${stream.path}`);

        let documents: DeserializedFirestoreDocument[] | null;

        // Stream data from source and write to Firestore
        while ((documents = await stream.read()) !== null) {
          await Promise.all(
            documents.map(async (document) => {
              // Check path depth
              const parts = document.path.split("/");
              const pathDepth = parts.length / 2 - 1;
              if (pathDepth > options.depth) {
                log(
                  LogLevel.DEBUG,
                  `Skipping path ${document.path} (exceeds max subcollection depth of ${options.depth})`
                );
                return;
              }

              if (patterns.length > 0) {
                // Check if path matches any patterns
                const matched = patterns.some((regex) => regex.test(document.path));
                if (!matched) {
                  log(
                    LogLevel.DEBUG,
                    `Skipping document ${document.path} (not matched)`
                  );
                  return;
                }
              }

              await firestore.doc(document.path).set(document.data);
              log(LogLevel.DEBUG, `Imported document ${document.path}`);
            })
          );
        }
      });

      log(
        LogLevel.DEBUG,
        `Collection ${collection} complete ${dim(duration.timeString)}`
      );

      // Signal the completion of the path to the parent
      process.send?.({
        type: "path-complete",
        path: collection,
      } as PathCompleteMessage);
    }
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

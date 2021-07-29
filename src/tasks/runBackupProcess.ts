import { log, time, wait, serializeDocument } from "../utils";
import { LogLevel } from "../types";

import { createCredentials } from "./createCredentials";
import { createFirestore } from "./createFirestore";
import { createOutStream } from "./createOutStream";

import type { WriteStream } from "fs";
import type {
  ChildMessage,
  CollectionPathMessage,
  Config,
  DocumentMessage,
  DocumentPathCompleteMessage,
} from "../types";

/* ======================================================

    This file is forked from `runBackup.ts` to write the
    data of document snapshots to the output stream, then
    notify the parent of any subcollections that the
    document has.

 * ======================================================
 */

let started = false;
let run = false;

const WAIT_TIME = 500;
const documents: DocumentMessage[] = [];

// React to messages from the parent process
process.on("message", (message: ChildMessage) => {
  switch (message.type) {
    // Start the main loop when we receive a config
    case "config":
      if (started) break;
      started = true;
      run = true;
      main(message.identifier, message.config);
      break;

    // Add documents to process
    case "document":
      documents.push(message);
      break;

    // Start the termination process
    case "finish":
      run = false;
      break;
  }
});

async function main(identifier: string | number, config: Config) {
  // Create Firestore instance
  const credentials = createCredentials(config);
  const firestore = createFirestore(config.project, credentials);

  // Mapping of out streams
  const streams: Record<string, WriteStream> = {};

  while (run) {
    const document = documents.pop();

    if (!document) {
      await wait(WAIT_TIME);
      continue;
    }

    const { duration } = await time(async () => {
      let stream = streams[document.root];

      // Create stream if it doesn't exist
      if (!stream) {
        stream = createOutStream(`${document.root}.snapshot`, config);
        streams[document.root] = stream;
        log(LogLevel.DEBUG, `Opened out stream to ${stream.path}`);
      }

      // Stream data to output
      await new Promise<void>((resolve, reject) => {
        const data = serializeDocument(document) + "\n";
        stream.write(data, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      // Get subcollections and send them to parent
      const subcollections = await firestore.doc(document.path).listCollections();
      if (subcollections.length > 0) {
        subcollections.forEach(({ path }) => {
          process.send?.({ type: "path", path } as CollectionPathMessage);
        });
      }
    });

    log(
      LogLevel.DEBUG,
      `Document path ${document.path} complete (${duration.timeString})`
    );

    // Signal the completion of the document to the parent
    process.send?.({
      type: "document-complete",
      path: document.path,
    } as DocumentPathCompleteMessage);
  }

  // Close out streams
  Object.keys(streams).forEach((key) => {
    const stream = streams[key];
    stream.end();
    log(LogLevel.DEBUG, `Closed out stream ${stream.path}`);
  });

  log(LogLevel.DEBUG, `Child ${identifier} (${process.pid}) finished`);
  process.exit(0);
}

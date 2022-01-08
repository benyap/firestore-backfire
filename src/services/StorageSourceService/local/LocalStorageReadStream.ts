import { createReadStream } from "fs";
import { Firestore } from "@google-cloud/firestore";

import { deserializeDocuments, JSONArrayParser } from "~/utils";
import { DeserializedFirestoreDocument } from "~/types";

import { IReadStream } from "../interfaces";

export class LocalStorageReadStream implements IReadStream {
  constructor(public readonly path: string, private firestore: Firestore) {}

  async readFromStream(onData: (data: DeserializedFirestoreDocument<any>[]) => any) {
    const parser = new JSONArrayParser();
    const stream = createReadStream(this.path);
    return new Promise<void>((resolve, reject) => {
      stream
        .on("error", (error) => reject(error))
        .on("readable", async () => {
          const buffer: Buffer | null = stream.read();
          if (buffer) parser.process(buffer.toString());
          const items = parser.flushItems();
          if (items.length > 0) {
            try {
              await onData(deserializeDocuments(this.firestore, items));
            } catch (error) {
              reject(error);
            }
          }
        })
        .on("end", () => resolve());
    });
  }
}

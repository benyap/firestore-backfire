import { Firestore } from "@google-cloud/firestore";
import { File } from "@google-cloud/storage";

import { DeserializedFirestoreDocument } from "~/types";
import { deserializeDocuments, JSONArrayParser } from "~/utils";

import { IReadStream } from "../interfaces";

export class GoogleStorageReadStream implements IReadStream {
  constructor(
    public readonly path: string,
    private firestore: Firestore,
    private readonly file: File
  ) {}

  async readFromStream(
    onData: (data: DeserializedFirestoreDocument<any>[]) => any
  ): Promise<void> {
    const parser = new JSONArrayParser();
    const stream = this.file.createReadStream();
    return new Promise<void>((resolve, reject) => {
      stream
        .on("error", (error) => reject(error))
        .on("readable", async () => {
          let buffer: Buffer | null = null;
          while ((buffer = stream.read()) !== null) {
            parser.process(buffer.toString());
            const items = parser.flushItems();
            if (items.length === 0) return;
            try {
              await onData(deserializeDocuments(this.firestore, items));
            } catch (error) {
              reject(error);
            }
          }
        })
        .on("end", () => {
          stream.destroy();
          resolve();
        });
    });
  }
}

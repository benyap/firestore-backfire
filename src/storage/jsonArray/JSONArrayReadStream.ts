import { createReadStream, ReadStream } from "fs";

import { deserializeDocuments } from "../../utils";

import { ReadStreamNotOpenError } from "../storage.errors";

import type { DeserializedFirestoreDocument } from "../../types";
import type { IReadStreamHandler } from "../storage.types";

export class JSONArrayReadStream implements IReadStreamHandler {
  private stream?: ReadStream;
  private inPath: string;

  private finished: boolean = false;

  constructor(public readonly path: string) {
    this.inPath = this.path.endsWith(".json") ? this.path : this.path + ".json";
  }

  async open() {
    this.stream = createReadStream(this.inPath, { encoding: "utf-8" });
    this.finished = false;
  }

  async read() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.inPath);

    // Return null if the stream is finished
    if (this.finished) return null;

    return new Promise<DeserializedFirestoreDocument<any>[] | null>(
      (resolve, reject) => {
        this.stream!.on("error", (error) => reject(error));

        let chunk: string | null = null;
        let allChunks: string | null = null;

        // Read all JSON data before we deserialize
        this.stream!.on("readable", () => {
          while ((chunk = this.stream!.read()) !== null) {
            if (!allChunks) allChunks = chunk;
            else allChunks += chunk;
          }
        });

        // Return the deserialized documents
        this.stream!.on("end", () => {
          this.finished = true;
          resolve(allChunks ? deserializeDocuments(allChunks) : null);
        });
      }
    );
  }

  async close() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.path);
    this.stream.close();
  }
}

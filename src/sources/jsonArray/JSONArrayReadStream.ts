import { createReadStream, ReadStream } from "fs";

import { ReadStreamNotOpenError } from "../../errors";
import { deserializeDocuments } from "../../utils";

import { DeserializedFirestoreDocument, IReadStreamHandler } from "../../types";

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
        let chunk: string | null = null;
        let allChunks: string | null = null;

        // Read all JSON data before we deserialize
        this.stream!.on("readable", () => {
          while ((chunk = this.stream!.read()) !== null) {
            if (!allChunks) allChunks = chunk;
            else allChunks += chunk;
          }
        });

        this.stream!.on("error", (error) => reject(error));

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

import { createReadStream } from "fs";
import { resolve } from "path";

import { ReadStreamNotOpenError, ReadStreamOpenError } from "../../errors";
import { deserializeDocuments } from "../../utils";

import type { ReadStream } from "fs";
import type { IReadStreamHandler } from "../../types";

export class FileReadStream implements IReadStreamHandler {
  protected stream?: ReadStream;
  protected inPath: string;

  private chunkData: string = "";

  constructor(public readonly path: string) {
    this.inPath = resolve(
      __dirname,
      "..",
      "..",
      "..",
      this.path.endsWith(".snapshot") ? this.path : this.path + ".snapshot"
    );
  }

  async open() {
    if (this.stream) throw new ReadStreamOpenError(this.inPath);
    this.stream = createReadStream(this.inPath, { encoding: "utf-8" });
    this.chunkData = "";
    return new Promise<void>((resolve, reject) => {
      this.stream!.on("readable", () => resolve());
      this.stream!.on("error", (error) => reject(error));
    });
  }

  async read() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.inPath);

    // Newline is used as a delimiter, so we read in chunks until we encounter a new line
    while (!this.chunkData.includes("\n")) {
      const chunk = this.stream.read() as string | null;
      if (!chunk) return null;
      this.chunkData += chunk;
    }

    // Get the first chunk as this should be guaranteed to be a complete record
    const [chunk, ...rest] = this.chunkData.split("\n");
    this.chunkData = rest.join("\n");

    // Return the deserialized documents
    return deserializeDocuments(chunk);
  }

  async close() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.path);
    this.stream.close();
    resolve();
  }
}

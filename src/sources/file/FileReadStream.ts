import { createReadStream } from "fs";

import { ReadStreamNotOpenError } from "../../errors";
import { deserializeDocuments } from "../../utils";

import type { ReadStream } from "fs";
import type { IReadStreamHandler } from "../../types";

export class FileReadStream implements IReadStreamHandler {
  private stream?: ReadStream;
  private inPath: string;

  private chunkData: string = "";

  constructor(public readonly path: string) {
    this.inPath = this.path.endsWith(".snapshot")
      ? this.path
      : this.path + ".snapshot";
  }

  async open() {
    this.stream = createReadStream(this.inPath, { encoding: "utf-8" });
    this.chunkData = "";
    await new Promise<void>((resolve) => {
      this.stream?.on("readable", () => resolve());
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
  }
}

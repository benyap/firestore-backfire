import { createReadStream } from "fs";

import { deserializeDocuments } from "../../utils";

import { ReadStreamNotOpenError } from "../storage.errors";

import type { ReadStream } from "fs";
import type { IReadStreamHandler } from "../storage.types";

export class FileReadStream implements IReadStreamHandler {
  private stream?: ReadStream;
  private inPath: string;

  private buffer: string = "";

  constructor(public readonly path: string) {
    this.inPath = this.path.endsWith(".snapshot")
      ? this.path
      : this.path + ".snapshot";
  }

  async open() {
    this.stream = createReadStream(this.inPath, { encoding: "utf-8" });
    this.buffer = "";
    await new Promise<void>((resolve, reject) => {
      this.stream?.once("readable", () => resolve());
      this.stream?.once("error", (error) => reject(error));
    });
  }

  async read() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.inPath);

    // Newline is used as a delimiter, so we read in chunks until we encounter a new line
    while (!this.buffer.includes("\n")) {
      const chunk = this.stream.read() as string | null;
      if (!chunk) return null;
      this.buffer += chunk;
    }

    // Process a chunk from the buffer
    const [chunk, ...leftover] = this.buffer.split("\n");
    const data = deserializeDocuments(chunk);

    // Add any left over data to the buffer to process next time
    this.buffer = leftover.join("\n");

    // Return the deserialized documents
    return data;
  }

  async close() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.path);
    this.stream.close();
  }
}

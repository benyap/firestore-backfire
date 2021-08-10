import { Bucket, File } from "@google-cloud/storage";

import { deserializeDocuments } from "../../utils";

import { ReadStreamNotOpenError } from "../storage.errors";

import type { Readable } from "stream";
import type { IReadStreamHandler } from "../storage.types";

export class GoogleStorageReadStream implements IReadStreamHandler {
  private file: File;
  private stream?: Readable;

  private buffer: string = "";
  private finished: boolean = false;

  constructor(public readonly path: string, private readonly bucket: Bucket) {
    this.file = this.bucket.file(path);
  }

  async open() {
    this.stream = this.file.createReadStream();
    this.finished = false;
    this.buffer = "";
  }

  async read() {
    if (!this.stream)
      throw new ReadStreamNotOpenError(`${this.bucket.name}/${this.path}`);

    if (!this.finished) {
      // Read from the stream until we have a new line or until the stream is finished
      do {
        await new Promise<void>((resolve) => {
          this.stream!.once("readable", () => {
            this.buffer += this.readStreamUntilEmpty(this.stream!);
            resolve();
          });
          this.stream!.once("end", () => {
            this.finished = true;
            resolve();
          });
        });
      } while (!this.buffer.includes("\n") && !this.finished);
    }

    if (!this.buffer) return null;

    // Process a chunk from the buffer
    const [chunk, ...leftover] = this.buffer.split("\n");
    const data = deserializeDocuments(chunk);

    // Add any left over data to the buffer to process next time
    this.buffer = leftover.join("\n");

    return data;
  }

  /**
   * Read a stream until it is empty.
   *
   * @param stream The stream to read from.
   * @returns The data from the stream.
   */
  private readStreamUntilEmpty(stream: Readable) {
    let buffer: Buffer | null = null;
    let data = "";
    while ((buffer = stream.read())) {
      const x = buffer.toString();
      data += x;
    }
    return data;
  }

  async close() {
    if (!this.stream)
      throw new ReadStreamNotOpenError(`${this.bucket.name}/${this.path}`);
    this.stream.destroy();
  }
}

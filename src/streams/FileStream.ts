import { createWriteStream } from "fs";
import { resolve } from "path";

import { WriteStreamNotOpenError, WriteStreamOpenError } from "../errors";
import { serializeDocument, createDirectory } from "../utils";

import type { WriteStream } from "fs";
import type { DocumentMessage, IWriteStreamHandler } from "../types";

export class FileStream implements IWriteStreamHandler {
  private stream?: WriteStream;
  private outPath: string;

  constructor(public readonly path: string) {
    this.outPath = resolve(__dirname, "..", "..", this.path + ".snapshot");
  }

  async open() {
    if (this.stream) throw new WriteStreamOpenError(this.path);
    createDirectory(resolve(this.outPath, ".."), { recursive: true });
    this.stream = createWriteStream(this.outPath, { flags: "a" });
    // writeFileSync(this.outPath, "");
  }

  async write(message: DocumentMessage) {
    const data = serializeDocument(message);
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.write(data + "\n", (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.end(null, () => {
        resolve();
      });
    });
  }
}

import { createWriteStream } from "fs";
import { resolve } from "path";
import { replaceInFile } from "replace-in-file";

import { serializeDocument, createDirectory } from "../../utils";

import { WriteStreamNotOpenError } from "../storage.errors";

import type { WriteStream } from "fs";
import type { DocumentMessage } from "../../types";
import type { IWriteStreamHandler } from "../storage.types";

export class JSONArrayWriteStream implements IWriteStreamHandler {
  protected stream?: WriteStream;
  protected outPath: string;

  constructor(public readonly path: string) {
    this.outPath = this.path + ".json";
  }

  async open() {
    createDirectory(resolve(this.outPath, ".."), { recursive: true });
    this.stream = createWriteStream(this.outPath, {
      flags: "a",
      encoding: "utf-8",
    });
  }

  async write(message: DocumentMessage) {
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      const data = serializeDocument(message, 2).replace(/^(.)/gm, "  $1");
      this.stream.write(data + "\n]\n", (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close() {
    // Close file stream
    await new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.end(null, () => resolve());
    });

    // Add commas and start / ending brackets for JSON array
    await replaceInFile({
      files: this.outPath,
      from: /^([^\[])/,
      to: "[\n$1",
    });

    await replaceInFile({
      files: this.outPath,
      from: /\n\]\n(.)/g,
      to: ",\n$1",
    });
  }
}

import { createWriteStream } from "fs";
import { resolve } from "path";

import { serializeDocument, createDirectory, listDirectory } from "../../utils";

import {
  WriteStreamLocationNotEmpty,
  WriteStreamNotOpenError,
} from "../storage.errors";

import type { WriteStream } from "fs";
import type { DocumentMessage } from "../../types";
import type { IWriteStreamHandler } from "../storage.types";

export class FileWriteStream implements IWriteStreamHandler {
  protected stream?: WriteStream;
  protected outPath: string;

  constructor(public readonly path: string) {
    this.outPath = this.path + ".snapshot";
  }

  async open() {
    const enclosingDirectory = resolve(this.outPath, "..");
    createDirectory(enclosingDirectory, { recursive: true });

    const files = listDirectory(enclosingDirectory);
    if (files.length > 0) throw new WriteStreamLocationNotEmpty(enclosingDirectory);

    this.stream = createWriteStream(this.outPath, {
      flags: "a",
      encoding: "utf-8",
    });
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
      this.stream.end(null, () => resolve());
    });
  }
}

import { Bucket, File } from "@google-cloud/storage";

import { serializeDocument } from "../../utils";
import {
  WriteStreamLocationNotEmpty,
  WriteStreamNotOpenError,
} from "../storage.errors";

import type { Writable } from "stream";
import type { DocumentMessage } from "../../types";
import type { IWriteStreamHandler } from "../storage.types";

export class GoogleStorageWriteStream implements IWriteStreamHandler {
  private file: File;
  private stream?: Writable;

  constructor(public readonly path: string, private readonly bucket: Bucket) {
    this.file = this.bucket.file(path);
  }

  async open() {
    const [files] = await this.bucket.getFiles({ prefix: this.path });
    if (files.length > 0)
      throw new WriteStreamLocationNotEmpty(`${this.bucket.name}/${this.path}`);
    this.stream = this.file.createWriteStream({ resumable: false });
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
    return new Promise<void>((resolve) => {
      if (!this.stream)
        throw new WriteStreamNotOpenError(`${this.bucket.name}/${this.path}`);
      this.stream.end(() => resolve());
    });
  }
}

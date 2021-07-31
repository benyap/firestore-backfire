import { readdir } from "fs";
import { resolve } from "path";

import { FileReadStream } from "./FileReadStream";
import { FileWriteStream } from "./FileWriteStream";

import type { IStorageSource } from "../../types";

export class FileSource implements IStorageSource {
  protected sourcePath: string;

  constructor(public readonly path: string) {
    this.sourcePath = resolve(__dirname, "..", "..", "..", this.path);
  }

  async listCollections() {
    return new Promise<string[]>((resolve, reject) => {
      readdir(this.sourcePath, (error, files) => {
        if (error) reject(error);
        else resolve(files);
      });
    });
  }

  async openReadStream(path: string) {
    const stream = new FileReadStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }

  async openWriteStream(path: string) {
    const stream = new FileWriteStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }
}

import { existsSync, readdir } from "fs";
import { resolve } from "path";
import root from "app-root-path";

import { JSONArrayReadStream } from "./JSONArrayReadStream";
import { JSONArrayWriteStream } from "./JSONArrayWriteStream";

import type { IStorageSource } from "../../types";

export class JSONArraySource implements IStorageSource {
  protected sourcePath: string;

  constructor(public readonly path: string) {
    this.sourcePath = resolve(root.toString(), this.path);
  }

  async listCollections() {
    return new Promise<string[]>((resolve, reject) => {
      if (!existsSync(this.sourcePath)) return resolve([]);
      readdir(this.sourcePath, (error, files) => {
        if (error) reject(error);
        else resolve(files);
      });
    });
  }

  async openReadStream(path: string) {
    const stream = new JSONArrayReadStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }

  async openWriteStream(path: string) {
    const stream = new JSONArrayWriteStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }
}

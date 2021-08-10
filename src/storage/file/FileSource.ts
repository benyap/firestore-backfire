import { existsSync, readdir } from "fs";
import { resolve } from "path";
import root from "app-root-path";

import { FileReadStream } from "./FileReadStream";
import { FileWriteStream } from "./FileWriteStream";

import { StorageSource } from "../storage.base";

export class FileSource extends StorageSource {
  protected sourcePath: string;

  constructor(path: string) {
    super(path);
    this.sourcePath = resolve(root.toString(), this.path);
  }

  async listImportPaths(prefixes?: string[]) {
    const paths = await new Promise<string[]>((resolve, reject) => {
      if (!existsSync(this.sourcePath)) return resolve([]);
      readdir(this.sourcePath, (error, files) => {
        if (error) reject(error);
        else resolve(files);
      });
    });

    const snapshotPaths = paths.filter((path) => path.endsWith(".snapshot"));

    if (!prefixes) return snapshotPaths;

    return snapshotPaths.filter((path) =>
      prefixes.some((prefix) => path.startsWith(prefix))
    );
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

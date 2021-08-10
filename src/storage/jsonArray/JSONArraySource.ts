import { existsSync, readdir } from "fs";
import { resolve } from "path";
import root from "app-root-path";

import { JSONArrayReadStream } from "./JSONArrayReadStream";
import { JSONArrayWriteStream } from "./JSONArrayWriteStream";

import { StorageSource } from "../storage.base";

export class JSONArraySource extends StorageSource {
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

    const jsonPaths = paths.filter((path) => path.endsWith(".json"));

    if (!prefixes) return jsonPaths;

    return jsonPaths.filter((path) =>
      prefixes.some((prefix) => path.startsWith(prefix))
    );
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

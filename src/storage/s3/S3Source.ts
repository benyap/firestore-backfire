import { S3ReadStream } from "./S3ReadStream";
import { S3WriteStream } from "./S3WriteStream";

import { StorageSource } from "../storage.base";

export class S3Source extends StorageSource {
  constructor(path: string) {
    super(path);
  }

  async listImportPaths(prefixes?: string[]) {
    console.log(prefixes);
    throw new Error("Method not implemented.");
    return [];
  }

  async openReadStream(path: string) {
    const stream = new S3ReadStream(`${this.path}/${path}`);
    await stream.open();
    return stream;
  }

  async openWriteStream(path: string) {
    const stream = new S3WriteStream(`${this.path}/${path}`);
    await stream.open();
    return stream;
  }
}

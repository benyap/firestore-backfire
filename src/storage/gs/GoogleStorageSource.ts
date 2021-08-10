import { Storage, Bucket } from "@google-cloud/storage";

import { GoogleStorageReadStream } from "./GoogleStorageReadStream";
import { GoogleStorageWriteStream } from "./GoogleStorageWriteStream";

import { StorageSource } from "../storage.base";

export class GoogleStorageSource extends StorageSource {
  private storage: Storage;
  private bucket: Bucket;
  private bucketName: string;
  private bucketPath: string;

  constructor(
    path: string,
    projectId: string,
    keyFilename?: string,
    credentials?: object
  ) {
    super(path);
    this.bucketName = this.path.slice(0, this.path.indexOf("/"));
    this.bucketPath = this.path.slice(this.path.indexOf("/") + 1);
    this.storage = new Storage({ projectId, keyFilename, credentials });
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async listImportPaths() {
    const [files] = await this.bucket.getFiles({ prefix: this.bucketPath });
    return files.map((file) =>
      file.name.replace(new RegExp(`^${this.bucketPath}/([^/]+/.)`), "$1")
    );
  }

  async openReadStream(path: string) {
    const stream = new GoogleStorageReadStream(
      [this.bucketPath, path].join("/"),
      this.bucket
    );
    await stream.open();
    return stream;
  }

  async openWriteStream(path: string, identifier: string | number) {
    const stream = new GoogleStorageWriteStream(
      [this.bucketPath, path, identifier].join("/"),
      this.bucket
    );
    await stream.open();
    return stream;
  }
}

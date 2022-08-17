import { Writable } from "stream";
import { File, Bucket, Storage, StorageOptions } from "@google-cloud/storage";

import { dir } from "~/utils";

import {
  DataSourceUnreachableError,
  DataOverwriteError,
  DataSourceError,
} from "../errors";
import { DataStreamWriter } from "../interface";

const GCS_PREFIX = new RegExp("^gs://");

export type GoogleCloudStorageOptions = {
  gcpProject: string;
  gcpKeyFile?: string;
  gcpCredentials?: NonNullable<StorageOptions["credentials"]>;
};

export class GoogleCloudStorageWriter extends DataStreamWriter {
  protected stream?: Writable;

  private storage: Storage;
  private bucket: Bucket;
  private file: File;

  constructor(
    override readonly path: string,
    projectId: string,
    options:
      | { keyFile: string }
      | { credentials: NonNullable<StorageOptions["credentials"]> }
  ) {
    super();

    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    if ("keyFile" in options) {
      this.storage = new Storage({
        projectId,
        keyFile: options.keyFile,
      });
    } else {
      this.storage = new Storage({
        projectId,
        credentials: options.credentials,
      });
    }

    const filePath = this.path.replace(GCS_PREFIX, "");
    const seperator = filePath.indexOf("/");

    const bucket = filePath.slice(0, seperator);
    const name = filePath.slice(seperator + 1);

    if (seperator === -1 || name === ".ndjson")
      throw new DataSourceError(
        `Invalid Google Cloud Storage file path: ${dir(this.path)}`
      );

    this.bucket = this.storage.bucket(bucket);
    this.file = this.bucket.file(name);
  }

  async open(overwrite?: boolean) {
    // Ensure bucket exists
    const [bucketExists] = await this.bucket.exists();
    if (!bucketExists)
      throw new DataSourceUnreachableError(
        "bucket does not exist or bucket is not accessible"
      );

    // Check if file exists
    let overwritten = false;
    const [fileExists] = await this.file.exists();
    if (fileExists) {
      if (!overwrite) throw new DataOverwriteError(this.path);
      // If `overwrite` is true, delete existing file
      await this.file.delete();
      overwritten = true;
    }

    // Create stream
    return new Promise<boolean>((resolve, reject) => {
      this.stream = this.file.createWriteStream({ resumable: false });
      this.stream.on("error", (error) => reject(error));
      resolve(overwritten);
    });
  }
}

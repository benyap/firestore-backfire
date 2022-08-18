import { Readable, Writable } from "stream";
import { File, Bucket, Storage, StorageOptions } from "@google-cloud/storage";

import { dir } from "~/utils";

import {
  DataSourceUnreachableError,
  DataOverwriteError,
  DataSourceError,
} from "../errors";
import { DataStreamReader, DataStreamWriter } from "../interface";

const GCS_PREFIX = new RegExp("^gs://");

export type GoogleCloudStorageOptions = {
  gcpProject: string;
  gcpKeyFile?: string;
  gcpCredentials?: NonNullable<StorageOptions["credentials"]>;
};

class GoogleCloudStorageSource {
  readonly storage: Storage;
  readonly bucket: Bucket;
  readonly file: File;

  constructor(
    readonly path: string,
    projectId: string,
    credentials: string | NonNullable<StorageOptions["credentials"]>
  ) {
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    if (typeof credentials === "string") {
      this.storage = new Storage({
        projectId,
        keyFile: credentials,
      });
    } else {
      this.storage = new Storage({
        projectId,
        credentials,
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

  async assertBucketExists() {
    const [bucketExists] = await this.bucket.exists();
    if (!bucketExists)
      throw new DataSourceUnreachableError(
        "bucket does not exist or is not accessible"
      );
  }

  async assertFileExists() {
    const [fileExists] = await this.file.exists();
    if (!fileExists)
      throw new DataSourceUnreachableError(
        "file does not exist or is not accessible"
      );
  }
}

export class GoogleCloudStorageReader extends DataStreamReader {
  private source: GoogleCloudStorageSource;

  protected stream?: Readable;

  constructor(
    path: string,
    projectId: string,
    credentials: string | NonNullable<StorageOptions["credentials"]>
  ) {
    super();
    this.source = new GoogleCloudStorageSource(path, projectId, credentials);
  }

  override get path() {
    return this.source.path;
  }

  async open(): Promise<void> {
    await this.source.assertBucketExists();
    await this.source.assertFileExists();
    this.stream = this.source.file.createReadStream();
  }
}

export class GoogleCloudStorageWriter extends DataStreamWriter {
  private source: GoogleCloudStorageSource;

  protected stream?: Writable;

  constructor(
    path: string,
    projectId: string,
    credentials: string | NonNullable<StorageOptions["credentials"]>
  ) {
    super();
    this.source = new GoogleCloudStorageSource(path, projectId, credentials);
  }

  override get path() {
    return this.source.path;
  }

  async open(overwrite?: boolean) {
    await this.source.assertBucketExists();

    // Check if file exists
    let overwritten = false;
    try {
      await this.source.assertFileExists();
      if (!overwrite) throw new DataOverwriteError(this.path);
      // If `overwrite` is true, delete existing file
      await this.source.file.delete();
      overwritten = true;
    } catch (error) {
      if (!(error instanceof DataSourceUnreachableError)) throw error;
    }

    // Create stream
    return new Promise<boolean>((resolve, reject) => {
      this.stream = this.source.file.createWriteStream({ resumable: false });
      this.stream.on("error", (error) => reject(error));
      resolve(overwritten);
    });
  }
}

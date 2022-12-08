import { Readable, Writable } from "stream";
import { File, Bucket, Storage } from "@google-cloud/storage";

import { dir } from "~/utils";

import {
  DataSourceUnreachableError,
  DataSourceOverwriteError,
  DataSourceError,
} from "../errors";
import { StreamReader, StreamWriter } from "../interface";

const GCS_PREFIX = new RegExp("^gs://");

export interface CredentialBody {
  client_email: string;
  private_key: string;
}

export type GoogleCloudStorageOptions = {
  gcpProject: string;
  gcpKeyFile?: string;
  gcpCredentials?: CredentialBody;
  gcpAdc?: boolean;
};

class GoogleCloudStorageSource {
  readonly storage: Storage;
  readonly bucket: Bucket;
  readonly file: File;

  constructor(
    readonly path: string,
    projectId: string,
    credentials?: string | CredentialBody
  ) {
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    if (typeof credentials === "string") {
      this.storage = new Storage({
        projectId,
        keyFile: credentials,
      });
    } else if (credentials) {
      this.storage = new Storage({
        projectId,
        credentials,
      });
    } else {
      this.storage = new Storage({ projectId });
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

export class GoogleCloudStorageReader extends StreamReader {
  private source: GoogleCloudStorageSource;

  protected stream?: Readable;

  constructor(
    path: string,
    projectId: string,
    credentials?: string | CredentialBody
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

export class GoogleCloudStorageWriter extends StreamWriter {
  private source: GoogleCloudStorageSource;

  protected stream?: Writable;

  constructor(
    path: string,
    projectId: string,
    credentials?: string | CredentialBody
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
      if (!overwrite) throw new DataSourceOverwriteError(this.path);
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

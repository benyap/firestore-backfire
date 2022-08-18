import { Writable, PassThrough, Readable } from "stream";
import {
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { Credentials, CredentialProvider } from "@aws-sdk/types";

import { dir } from "~/utils";

import {
  DataSourceUnreachableError,
  DataOverwriteError,
  DataSourceError,
} from "../errors";
import { DataStreamReader, DataStreamWriter } from "../interface";

const S3_PREFIX = new RegExp("^s3://");

export interface S3Options {
  awsRegion: string;
  awsProfile?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

class S3Source {
  readonly client: S3Client;
  readonly Bucket: string;
  readonly Key: string;

  constructor(
    readonly path: string,
    region: string,
    credentials: Credentials | CredentialProvider
  ) {
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    this.client = new S3Client({ region, credentials });

    const filePath = this.path.replace(S3_PREFIX, "");
    const seperator = filePath.indexOf("/");

    this.Bucket = filePath.slice(0, seperator);
    this.Key = filePath.slice(seperator + 1);

    if (seperator === -1 || this.Key === ".ndjson")
      throw new DataSourceError(`Invalid S3 object path: ${dir(this.path)}`);
  }

  async assertBucketExists() {
    try {
      await this.client.send(new HeadBucketCommand(this));
    } catch (error) {
      throw new DataSourceUnreachableError(
        "bucket does not exist or is not accessible",
        error as Error
      );
    }
  }

  async assertFileExists() {
    try {
      await this.client.send(new HeadObjectCommand(this));
    } catch (error) {
      throw new DataSourceUnreachableError(
        "file does not exist or is not accessible",
        error as Error
      );
    }
  }
}

export class S3Reader extends DataStreamReader {
  private source: S3Source;

  protected stream?: Readable;

  constructor(
    path: string,
    region: string,
    credentials: Credentials | CredentialProvider
  ) {
    super();
    this.source = new S3Source(path, region, credentials);
  }

  override get path() {
    return this.source.path;
  }

  async open(): Promise<void> {
    await this.source.assertBucketExists();
    await this.source.assertFileExists();
    const command = new GetObjectCommand(this.source);
    const response = await this.source.client.send(command);
    this.stream = response.Body as Readable;
  }
}

export class S3Writer extends DataStreamWriter {
  private source: S3Source;

  protected upload?: Upload;
  protected stream?: Writable;

  constructor(
    path: string,
    region: string,
    credentials: Credentials | CredentialProvider
  ) {
    super();
    this.source = new S3Source(path, region, credentials);
  }

  override get path() {
    return this.source.path;
  }

  async open(overwrite?: boolean) {
    await this.source.assertBucketExists();

    let overwritten = false;
    try {
      await this.source.assertFileExists();
      if (!overwrite) throw new DataOverwriteError(this.path);
      // If `overwrite` is true, delete existing file
      await this.source.client.send(new DeleteObjectCommand(this.source));
      overwritten = true;
    } catch (error) {
      if (!(error instanceof DataSourceUnreachableError)) throw error;
    }

    // Create stream
    return new Promise<boolean>((resolve) => {
      // FIXME: currently broken if uploading more than 16,383 bytes of data
      // https://github.com/aws/aws-sdk-js/issues/4188
      this.stream = new PassThrough();
      this.upload = new Upload({
        client: this.source.client,
        params: {
          Bucket: this.source.Bucket,
          Key: this.source.Key,
          Body: this.stream as any,
        },
      });
      resolve(overwritten);
    });
  }

  override async close() {
    await super.close();
    await this.upload!.done();
  }
}

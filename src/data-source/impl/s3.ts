import { Writable, PassThrough } from "stream";
import {
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
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
import { DataStreamWriter } from "../interface";

const S3_PREFIX = new RegExp("^s3://");

export interface S3Options {
  awsRegion: string;
  awsProfile?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

export class S3Writer extends DataStreamWriter {
  protected stream?: Writable;
  protected upload?: Upload;

  private client: S3Client;
  private object: { Bucket: string; Key: string };

  constructor(
    override readonly path: string,
    region: string,
    credentials: Credentials | CredentialProvider
  ) {
    super();

    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    this.client = new S3Client({ region, credentials });

    const filePath = this.path.replace(S3_PREFIX, "");
    const seperator = filePath.indexOf("/");

    const Bucket = filePath.slice(0, seperator);
    const Key = filePath.slice(seperator + 1);

    if (seperator === -1 || Key === ".ndjson")
      throw new DataSourceError(`Invalid S3 object path: ${dir(this.path)}`);

    this.object = { Bucket, Key };
  }

  async open(overwrite?: boolean) {
    // Ensure bucket exists
    try {
      await this.client.send(new HeadBucketCommand(this.object));
    } catch {
      throw new DataSourceUnreachableError(
        "bucket does not exist or bucket is not accessible"
      );
    }

    // Check if file exists
    let overwritten = false;
    try {
      await this.client.send(new HeadObjectCommand(this.object));

      if (!overwrite) throw new DataOverwriteError(this.path);
      // If `overwrite` is true, delete existing file
      await this.client.send(new DeleteObjectCommand(this.object));
      overwritten = true;
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      if (error.name !== "NotFound") throw error;
    }

    // Create stream
    return new Promise<boolean>((resolve) => {
      this.stream = new PassThrough();
      this.upload = new Upload({
        client: this.client,
        params: { ...this.object, Body: this.stream as any },
      });
      resolve(overwritten);
    });
  }

  override async close() {
    await super.close();
    await this.upload!.done();
  }
}

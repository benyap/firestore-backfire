import { Readable } from "stream";
import {
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  GetObjectOutput,
} from "@aws-sdk/client-s3";
import type {
  AwsCredentialIdentity,
  AwsCredentialIdentityProvider,
} from "@aws-sdk/types";

import { dir } from "~/utils";

import {
  DataSourceUnreachableError,
  DataSourceOverwriteError,
  DataSourceError,
  DataSourceWriterNotOpenedError,
} from "../errors";
import { StreamReader, IDataSourceWriter } from "../interface";

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
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider,
    region?: string | undefined,
  ) {
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";

    this.client = region
      ? new S3Client({ credentials, region })
      : new S3Client({ credentials });

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
        error as Error,
      );
    }
  }

  async assertFileExists() {
    try {
      await this.client.send(new HeadObjectCommand(this));
    } catch (error) {
      throw new DataSourceUnreachableError(
        "file does not exist or is not accessible",
        error as Error,
      );
    }
  }
}

export class S3Reader extends StreamReader {
  private source: S3Source;

  protected stream?: Readable;

  constructor(
    path: string,
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider,
    region?: string | undefined,
  ) {
    super();
    this.source = new S3Source(path, credentials, region);
  }

  override get path() {
    return this.source.path;
  }

  async open(): Promise<void> {
    await this.source.assertBucketExists();
    await this.source.assertFileExists();
    const command = new GetObjectCommand(this.source);
    const response: GetObjectOutput = await this.source.client.send(command);
    this.stream = response.Body as Readable;
  }
}

export class S3Writer implements IDataSourceWriter {
  /** Minimum part size. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html */
  private readonly PART_SIZE = 5 * 1024 * 1024;
  private source: S3Source;

  protected upload?: {
    id: string;
    buffer: string;
    parts: Promise<{ PartNumber: number; ETag: string }>[];
  };

  constructor(
    path: string,
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider,
    region?: string | undefined,
  ) {
    this.source = new S3Source(path, credentials, region);
  }

  get path() {
    return this.source.path;
  }

  get object() {
    return { Bucket: this.source.Bucket, Key: this.source.Key };
  }

  async open(overwrite?: boolean) {
    await this.source.assertBucketExists();

    let overwritten = false;
    try {
      await this.source.assertFileExists();
      if (!overwrite) throw new DataSourceOverwriteError(this.path);
      overwritten = true;
    } catch (error) {
      if (!(error instanceof DataSourceUnreachableError)) throw error;
    }

    // Create a new multipart upload
    const command = new CreateMultipartUploadCommand({
      ...this.object,
      ContentType: "application/x-ndjson",
    });
    const response = await this.source.client.send(command);

    this.upload = {
      id: response.UploadId!,
      buffer: "",
      parts: [],
    };

    return overwritten;
  }

  async write(lines: string[]): Promise<void> {
    if (!this.upload) throw new DataSourceWriterNotOpenedError();
    if (!this.upload.buffer.endsWith("\n")) this.upload.buffer += "\n";
    this.upload.buffer += lines.join("\n");
    // Split buffer into parts and upload each part individually
    while (this.upload.buffer.length > this.PART_SIZE) {
      const data = this.upload.buffer.slice(0, this.PART_SIZE);
      this.upload.buffer = this.upload.buffer.slice(this.PART_SIZE);
      const part = this.uploadPart(data, this.upload.parts.length + 1);
      this.upload.parts.push(part);
    }
  }

  async close() {
    if (!this.upload) throw new DataSourceWriterNotOpenedError();

    // Upload anything remaining in the buffer
    if (this.upload.buffer.length > 0) {
      const part = this.uploadPart(
        this.upload.buffer,
        this.upload.parts.length + 1,
      );
      this.upload.parts.push(part);
    }

    // Complete multipart upload
    const parts = await Promise.all(this.upload.parts);
    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);
    const command = new CompleteMultipartUploadCommand({
      ...this.object,
      UploadId: this.upload.id,
      MultipartUpload: { Parts: sortedParts },
    });
    await this.source.client.send(command);
  }

  private async uploadPart(data: string, partNumber: number) {
    if (!this.upload) throw new DataSourceWriterNotOpenedError();
    const command = new UploadPartCommand({
      ...this.object,
      UploadId: this.upload.id,
      PartNumber: partNumber,
      Body: data,
    });
    const response = await this.source.client.send(command);
    return { PartNumber: partNumber, ETag: response.ETag! };
  }
}

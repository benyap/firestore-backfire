import {
  S3Client,
  HeadBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Credentials, CredentialProvider } from "@aws-sdk/types";

import { bucketFromPath, keyFromPath } from "~/utils";

import { StorageObject } from "../types";
import { IReadStream, IStorageSourceService, IWriteStream } from "../interfaces";

import { S3StorageWriteStream } from "./S3StorageWriteStream";
import { S3StorageReadStream } from "./S3StorageReadStream";

export class S3StorageSourceService implements IStorageSourceService {
  readonly name = "AWS S3";

  private client: S3Client;

  constructor(region: string, credentials: Credentials | CredentialProvider) {
    this.client = new S3Client({ region, credentials });
  }

  async testConnection(
    path?: string
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    if (!path) {
      throw new Error("cannot test S3 connection without path");
    } else {
      try {
        await this.client.send(
          new HeadBucketCommand({ Bucket: bucketFromPath("s3", path) })
        );
      } catch (error: any) {
        return { ok: false, error: error.$metadata.httpStatusCode };
      }
    }
    return { ok: true };
  }

  async listObjects(path: string): Promise<StorageObject[]> {
    const bucket = bucketFromPath("s3", path);
    const prefix = keyFromPath("s3", path);
    const listCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
    const objects = await this.client.send(listCommand);
    return (
      objects.Contents?.filter(
        (o): o is { Key: string; LastModified: Date; Size: number } =>
          Boolean(o.Key && o.LastModified && o.Size)
      ).map((o) => ({
        path: `s3://${bucket}/${o.Key}`,
        modified: o.LastModified,
        size: o.Size,
      })) ?? []
    );
  }

  async openReadStream(
    path: string,
    firestore: FirebaseFirestore.Firestore
  ): Promise<IReadStream> {
    const bucket = bucketFromPath("s3", path);
    const key = keyFromPath("s3", path);
    return new S3StorageReadStream(path, firestore, this.client, bucket, key);
  }

  async openWriteStream(
    path: string,
    force?: boolean
  ): Promise<{ stream: IWriteStream; overwritten: boolean }> {
    const bucket = bucketFromPath("s3", path);
    const key = keyFromPath("s3", path);
    const stream = new S3StorageWriteStream(path, this.client, bucket, key);
    const overwritten = await stream.open(force);
    return { stream, overwritten };
  }
}

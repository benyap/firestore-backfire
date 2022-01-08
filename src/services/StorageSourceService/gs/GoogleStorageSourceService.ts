import { Storage } from "@google-cloud/storage";

import { bucketFromPath, keyFromPath } from "~/utils";

import { IReadStream, IStorageSourceService, IWriteStream } from "../interfaces";
import { StorageObject } from "../types";

import { GoogleStorageReadStream } from "./GoogleStorageReadStream";
import { GoogleStorageWriteStream } from "./GoogleStorageWriteStream";
import { GoogleStorageSourceOptions } from "./types";

export class GoogleStorageSourceService implements IStorageSourceService {
  readonly name = "Google Cloud";

  private storage: Storage;

  constructor(
    projectId: string,
    keyFilename?: string,
    credentials?: GoogleStorageSourceOptions["gcpCredentials"]
  ) {
    this.storage = new Storage({ projectId, keyFilename, credentials });
  }

  async testConnection(
    path?: string
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      if (!path) {
        await this.storage.getServiceAccount();
      } else {
        const bucket = this.storage.bucket(bucketFromPath("gs", path));
        const [exists] = await bucket.exists();
        if (!exists) return { ok: false, error: "bucket does not exist" };
      }
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  async listObjects(path: string): Promise<StorageObject[]> {
    const bucket = this.storage.bucket(bucketFromPath("gs", path));
    const [files] = await bucket.getFiles({ prefix: keyFromPath("gs", path) });
    return files.map(({ metadata }) => ({
      path: `gs://${metadata.bucket}/${metadata.name}`,
      modified: new Date(metadata.timeCreated),
      size: Number(metadata.size),
    }));
  }

  async openReadStream(
    path: string,
    firestore: FirebaseFirestore.Firestore
  ): Promise<IReadStream> {
    const bucket = this.storage.bucket(bucketFromPath("gs", path));
    const file = bucket.file(keyFromPath("gs", path));
    return new GoogleStorageReadStream(path, firestore, file);
  }

  async openWriteStream(
    path: string,
    force?: boolean
  ): Promise<{ stream: IWriteStream; overwritten: boolean }> {
    const bucket = this.storage.bucket(bucketFromPath("gs", path));
    const file = bucket.file(keyFromPath("gs", path));
    const stream = new GoogleStorageWriteStream(path, file);
    const overwritten = await stream.open(force);
    return { stream, overwritten };
  }
}

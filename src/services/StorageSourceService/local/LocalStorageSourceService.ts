import { statSync, readdirSync } from "fs";
import { resolve } from "path";
import root from "app-root-path";
import { Firestore } from "@google-cloud/firestore";

import { IReadStream, IStorageSourceService, IWriteStream } from "../interfaces";
import { StorageObject } from "../types";

import { LocalStorageReadStream } from "./LocalStorageReadStream";
import { LocalStorageWriteStream } from "./LocalStorageWriteStream";

export class LocalStorageSourceService implements IStorageSourceService {
  readonly name = "local";

  async testConnection(): Promise<{ ok: true } | { ok: false; error: string }> {
    return { ok: true };
  }

  async listObjects(path: string): Promise<StorageObject[]> {
    const objects = readdirSync(resolve(root.toString(), path));
    return objects.map((file) => {
      const objectPath = resolve(root.toString(), path, file);
      const info = statSync(objectPath);
      return {
        path: objectPath,
        size: info.size,
        modified: info.mtime,
      };
    });
  }

  async openReadStream(path: string, firestore: Firestore): Promise<IReadStream> {
    const outputPath = resolve(root.toString(), path);
    const stream = new LocalStorageReadStream(outputPath, firestore);
    return stream;
  }

  async openWriteStream(
    path: string,
    force?: boolean
  ): Promise<{ stream: IWriteStream; overwritten: boolean }> {
    const outputPath = resolve(root.toString(), path);
    const stream = new LocalStorageWriteStream(outputPath);
    const overwritten = await stream.open(force);
    return { stream, overwritten };
  }
}

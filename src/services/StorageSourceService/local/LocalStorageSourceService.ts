import {
  createWriteStream,
  statSync,
  readdirSync,
  WriteStream,
  createReadStream,
} from "fs";
import { resolve } from "path";
import root from "app-root-path";
import { Firestore } from "@google-cloud/firestore";

import { DeserializedFirestoreDocument } from "~/types";
import {
  createDirectory,
  serializeDocument,
  JSONArrayStream,
  deserializeDocuments,
} from "~/utils";
import { WriteStreamNotOpenError } from "~/errors";

import { IReadStream, IStorageSourceService, IWriteStream } from "../interfaces";
import { StorageObject, DocumentWrite } from "../types";

export class LocalStorageSourceService implements IStorageSourceService {
  readonly name = "local";

  async testConnection(): Promise<boolean> {
    return true;
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

  async openWriteStream(path: string): Promise<IWriteStream> {
    const outputPath = resolve(root.toString(), path);
    const stream = new LocalStorageWriteStream(outputPath);
    await stream.open();
    return stream;
  }
}

export class LocalStorageReadStream implements IReadStream {
  private stream: JSONArrayStream;

  constructor(public readonly path: string, private firestore: Firestore) {
    this.stream = new JSONArrayStream(createReadStream(path));
  }

  async read(): Promise<DeserializedFirestoreDocument<any>[] | null> {
    await this.stream.consume();
    const documents = this.stream.flush();
    if (documents) return deserializeDocuments(this.firestore, documents);
    return null;
  }

  async close(): Promise<void> {
    await this.stream.close();
  }
}

export class LocalStorageWriteStream implements IWriteStream {
  private stream?: WriteStream;
  private empty?: boolean = true;

  constructor(public readonly path: string) {}

  async open(): Promise<void> {
    createDirectory(resolve(this.path, ".."));
    return new Promise<void>((resolve, reject) => {
      this.stream = createWriteStream(this.path, { flags: "ax", encoding: "utf-8" });
      this.stream.on("error", (error) => reject(error));
      this.stream.on("open", () => resolve());
    });
  }

  async write(document: DocumentWrite): Promise<void> {
    const wasEmpty = this.empty;
    this.empty = false;
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) throw new WriteStreamNotOpenError(this.path);
      const data = serializeDocument(document, 2).replace(/^(.)/gm, "  $1");
      this.stream.write((wasEmpty ? "[\n" : ",\n") + data, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.end(this.empty ? "[]" : "\n]", () => resolve());
    });
  }
}

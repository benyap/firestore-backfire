import { Firestore } from "@google-cloud/firestore";

import { DeserializedFirestoreDocument } from "~/types";

import { DocumentWrite, StorageObject } from "./types";

export interface IStorageSourceService {
  /**
   * The name of the storage source.
   */
  readonly name: string;

  /**
   * Returns `true` if the service is able to read from the storage source.
   *
   * @param timeout The time to wait before returning `false`.
   */
  testConnection(timeout?: number): Promise<boolean>;

  /**
   * List the storage objects available at the specified path.
   */
  listObjects(path: string): Promise<StorageObject[]>;

  /**
   * Open a read stream to the storage object at the specified path.
   */
  openReadStream(path: string, firestore: Firestore): Promise<IReadStream>;

  /**
   * Open a write stream to the storage object at the specified
   */
  openWriteStream(path: string): Promise<IWriteStream>;
}

export interface IReadStream {
  /**
   * The path to the stream.
   */
  path: string;

  /**
   * Read some documents from the stream.
   */
  read(): Promise<DeserializedFirestoreDocument[] | null>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

export interface IWriteStream {
  /**
   * The path to the stream.
   */
  path: string;

  /**
   * Open the write stream for writing data.
   */
  open(): Promise<void>;

  /**
   * Write a document to the stream.
   *
   * @param document The document to write.
   */
  write(document: DocumentWrite): Promise<void>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

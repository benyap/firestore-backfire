import { Firestore } from "@google-cloud/firestore";

import { SerializedFirestoreDocument, DeserializedFirestoreDocument } from "~/types";

import { StorageObject } from "./types";

export interface IStorageSourceService {
  /**
   * The name of the storage source.
   */
  readonly name: string;

  /**
   * Returns `true` if the service is able to read from the storage source.
   *
   * @param path Test connection to the specified path.
   * @param timeout The time to wait before returning a result.
   */
  testConnection(
    path?: string,
    timeout?: number
  ): Promise<{ ok: true } | { ok: false; error: string }>;

  /**
   * List the storage objects available at the specified path.
   *
   * @param path The path to list objects from.
   */
  listObjects(path: string): Promise<StorageObject[]>;

  /**
   * Open a read stream to the storage object at the specified path.
   *
   * @param path The path to read from.
   * @param firestore Firestore instance to use for constructing Firestore fields (i.e. Timestamp, GeoPoint, Reference).
   */
  openReadStream(path: string, firestore: Firestore): Promise<IReadStream>;

  /**
   * Open a write stream to the storage object at the specified path.
   *
   * @param path The path to write to.
   * @param force If `true`, any existing data at the write location will be overwritten.
   */
  openWriteStream(
    path: string,
    force?: boolean
  ): Promise<{ stream: IWriteStream; overwritten: boolean }>;
}

export interface IReadStream {
  /**
   * The path to the stream.
   */
  path: string;

  /**
   * Read documents from the stream.
   */
  readFromStream(
    onData: (data: DeserializedFirestoreDocument<any>[]) => any
  ): Promise<void>;
}

export interface IWriteStream {
  /**
   * The path to the stream.
   */
  path: string;

  /**
   * Open the write stream for writing data.
   *
   * @param force If `true`, any existing data at the write location will be overwritten.
   * @returns `true` if any existing data was overwritten.
   */
  open(force?: boolean): Promise<boolean>;

  /**
   * Write a document to the stream.
   *
   * @param document The serialized document to write.
   * @param indent If specified, the document will be prettified with the indent.
   */
  write(document: SerializedFirestoreDocument, indent?: number): Promise<void>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

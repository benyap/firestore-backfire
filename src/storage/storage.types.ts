import type { DocumentMessage, DeserializedFirestoreDocument } from "../types";

export enum StorageProtocol {
  SnapshotFile = "file",
  JSONFile = "json",
  GoogleCloudStorage = "gs",
  // S3 = 's3'
}

/**
 * List of supported storage protocols.
 */
export const SUPPORTED_STORAGE_PROTOCOLS = new Set(Object.values(StorageProtocol));

/**
 * A storage source represents a medium that allows us to read data for
 * import into Firestore and write data for export from Firestore.
 */
export interface IStorageSource {
  /**
   * The path to the storage medium.
   */
  path: string;

  /**
   * Connect to the storage source. Throws an error if the connection fails.
   */
  connect(): Promise<void>;

  /**
   * Return a list of the paths available for import from the storage
   * source. If a list of prefixes are provided, only paths that match
   * a prefix are returned.
   */
  listImportPaths(prefixes?: string[]): Promise<string[]>;

  /**
   * Create a read stream at the specified path in the storage source.
   *
   * @param path The path to read from.
   * @param identifier An identifier for the stream, required if streams are writing to immutable objects.
   */
  openReadStream(
    path: string,
    identifier?: string | number
  ): Promise<IReadStreamHandler>;

  /**
   * Create a write stream at the specified path in the storage source.
   *
   * @param path The path to write to.
   * @param identifier An identifier for the stream, required if streams are writing to immutable objects.
   */
  openWriteStream(
    path: string,
    identifier?: string | number
  ): Promise<IWriteStreamHandler>;
}

/**
 * A write stream handler allows a Firestore document to be serialized
 * and written to a file in a storage source.
 */
export interface IWriteStreamHandler {
  /**
   * The write stream path.
   */
  path: string;

  /**
   * Open the write stream for writing data.
   */
  open(): Promise<void>;

  /**
   * Write a document to the stream.
   *
   * @param message The document to write.
   */
  write(message: DocumentMessage): Promise<void>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

/**
 * A read stream handler allows a serialized Firestore documents to be
 * read and deserialized from a file in a storage source.
 */
export interface IReadStreamHandler {
  /**
   * The read stream path.
   */
  path: string;

  /**
   * Open the read stream for reading data.
   */
  open(): Promise<void>;

  /**
   * Read some documents from the stream.
   */
  read(): Promise<DeserializedFirestoreDocument[] | null>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

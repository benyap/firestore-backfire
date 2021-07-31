import { DeserializedFirestoreDocument } from "./firestore";
import { DocumentMessage } from "./message";

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
   * Return a list of the collections stored in the storage path.
   */
  listCollections(): Promise<string[]>;

  /**
   * Create a read stream at the specified path in the storage source.
   *
   * @param path The path to read from.
   */
  openReadStream(path: string): Promise<IReadStreamHandler>;

  /**
   * Create a write stream at the specified path in the storage source.
   *
   * @param path The path to write to.
   */
  openWriteStream(path: string): Promise<IWriteStreamHandler>;
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

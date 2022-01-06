import { LocalStorageSourceOptions } from "./local";
import { GCSStorageSourceOptions } from "./gcs";
import { S3StorageSourceOptions } from "./s3";

/**
 * Options for connecting to a data source.
 */
export type StorageSourceOptions =
  | LocalStorageSourceOptions
  | GCSStorageSourceOptions
  | S3StorageSourceOptions;

/**
 * A storage object is a file from a storage source that
 * contains a chunk of exported Firestore data.
 */
export interface StorageObject {
  path: string;
  size: number;
  modified: Date;
}

export interface DocumentWrite {
  path: string;
  data: any;
}

import { LocalStorageSourceOptions } from "./local";
import { GoogleStorageSourceOptions } from "./gs";
import { S3StorageSourceOptions } from "./s3";

/**
 * Options for connecting to a data source.
 */
export type StorageSourceOptions =
  | { type: "unknown"; path?: string }
  | LocalStorageSourceOptions
  | GoogleStorageSourceOptions
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

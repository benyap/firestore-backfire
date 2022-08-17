import { GoogleCloudStorageOptions } from "../impl/gcs";
import { LocalFileOptions } from "../impl/local";
import { S3Options } from "../impl/s3";

type AllowPartialUndefined<T> = { [P in keyof T]?: T[P] | undefined };

export type DataSourceOptions = AllowPartialUndefined<
  LocalFileOptions & GoogleCloudStorageOptions & S3Options
>;

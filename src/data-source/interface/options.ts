import type { GoogleCloudStorageOptions } from "../impl/gcs";
import type { S3Options } from "../impl/s3";

type AllowPartialUndefined<T> = { [P in keyof T]?: T[P] | undefined };

export type DataSourceOptions = AllowPartialUndefined<
  GoogleCloudStorageOptions & S3Options
>;

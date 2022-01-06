/**
 * Options for connecting to a AWS S3 source.
 *
 * @todo Not implemented yet
 */
export interface S3StorageSourceOptions {
  type: "s3";

  /**
   * The path to the S3 bucket to read or write from. Must be prefixed with `s3://`
   */
  path: string;
}

/**
 * Options for connecting to an AWS S3 source.
 */
export interface S3StorageSourceOptions {
  type: "s3";

  /**
   * The path to the S3 bucket to read or write from. Must be prefixed
   * with `s3://`.
   */
  path: string;

  /**
   * The AWS region to use.
   */
  awsRegion?: string;

  /**
   * The profile to load from the shared credentials file `~/.aws/credentials`.
   */
  awsProfile?: string;

  /**
   * The AWS access key id. Use in conjuction with `awsSecretAccessKey`.
   * Takes precedence over `awsProfile`.
   */
  awsAccessKeyId?: string;

  /**
   * The AWS secret access key. Use in conjunction with `awsAccessKeyId`.
   * Takes precedence over `awsProfile`.
   */
  awsSecretAccessKey?: string;
}

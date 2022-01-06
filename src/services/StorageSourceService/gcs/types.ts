import type { Settings } from "@google-cloud/firestore";

/**
 * Options for connecting to a Google Cloud Storage source.
 */
export interface GCSStorageSourceOptions {
  type: "gcs";

  /**
   * The path to the Google Cloud Storage bucket to read or write from. Must be prefixed with `gs://`
   */
  path: string;

  /**
   * The Google Cloud project to write to.
   */
  gcsProject?: string;

  /**
   * The path to the service account credentials to use for connecting to the Google Cloud project.
   */
  gcsKeyfile?: string;

  /**
   * The credentials to use for connecting to the Google Cloud project.
   */
  gcsCredentials?: Settings["credentials"];
}

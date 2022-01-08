import type { Settings } from "@google-cloud/firestore";

/**
 * Options for connecting to a Google Storage source.
 */
export interface GoogleStorageSourceOptions {
  type: "gs";

  /**
   * The path to the Google Storage bucket to read or write from. Must be prefixed with `gs://`
   */
  path: string;

  /**
   * The Google Cloud project the storage bucket is in.
   */
  gcpProject?: string;

  /**
   * The path to the service account credentials to use for connecting to Google Storage.
   */
  gcpKeyfile?: string;

  /**
   * The credentials to use for connecting to Google Storage.
   */
  gcpCredentials?: Settings["credentials"];
}

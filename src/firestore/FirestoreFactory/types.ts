import { Settings } from "@google-cloud/firestore";

export interface FirestoreConnectionOptions {
  /**
   * The Firestore project to connect to.
   */
  project?: string;

  /**
   * The path to the service account private key to use to connect to Firestore.
   */
  keyFile?: string;

  /**
   * The service account credentials to use to connect to Firestore.
   *
   * Takes precedence over `keyFile`.
   */
  credentials?: Required<Settings["credentials"]>;

  /**
   * The host and port of the local Firestore emulator to connect to.
   *
   * Takes precedence over `keyFile` and `credentials`.
   */
  emulator?: string | boolean;
}

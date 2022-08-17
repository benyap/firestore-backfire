import { Settings } from "@google-cloud/firestore";

export type FirestoreConnectionOptions = {
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
   * Takes precedence over `keyfile`.
   */
  credentials?: Required<Settings["credentials"]>;

  /**
   * The host and port of the local Firestore emulator to connect to.
   *
   * Takes precedence over `keyfile` and `credentials`.
   */
  emulator?: string;
};

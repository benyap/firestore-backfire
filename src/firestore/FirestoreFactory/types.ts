import { Settings } from "@google-cloud/firestore";

export interface FirestoreConnectionOptions {
  /**
   * The Firestore project to connect to.
   */
  project?: string;

  /**
   * Use [Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)
   * to connect to Firestore.
   */
  adc?: boolean;

  /**
   * The path to the service account private key to use to connect to Firestore.
   *
   * Takes precedence over {@link adc}.
   */
  keyFile?: string;

  /**
   * The host and port of the local Firestore emulator to connect to.
   *
   * Takes precedence over {@link keyFile} and {@link adc}.
   */
  emulator?: string | boolean;

  /**
   * The service account credentials to use to connect to Firestore.
   *
   * Takes precedence over {@link keyFile}, {@link emulator} and {@link adc}.
   */
  credentials?: Required<Settings["credentials"]>;

  /**
   * Provide a Firestore instance directly.
   *
   * Takes precedence over all other connection options.
   */
  firestore?: FirebaseFirestore.Firestore;
}

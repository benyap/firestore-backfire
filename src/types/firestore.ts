import type { Settings } from "@google-cloud/firestore";

import type { LogLevel } from "~/utils";

export interface FirestoreDataOptions {
  /**
   * Provide a list of root collections to import/export.
   * Documents not belonging to the specified root collections
   * are ignored. If none are provided, all collections are used.
   */
  collections?: string[];

  /**
   * Provide a list of patterns (regexes) which filter which
   * documents to import/export. If more than one pattern is
   * provided, a document's path must match at least one pattern
   * to be imported/exported.
   */
  patterns?: RegExp[];

  /**
   * Limit the subcollection depth to import/export. A document
   * in a root collection has a depth of 0. Subcollections from
   * a document in a root collection has a depth of 1, and so on.
   *
   * If not provided, all subcollections are imported/exported.
   */
  depth?: number;

  /**
   * Specify the number of worker threads to use. Defaults to
   * the number of logical CPUs available as reported by the
   * [Node.js API](https://nodejs.org/api/os.html#oscpus) when
   * exporting, and the number of chunks to read when importing.
   *
   * When importing and exporting programatically, it is recommended
   * to keep this value consistent. Also ensure that this number
   * is not too much higher the actual cores available on your
   * machine as it probably won't be of much a benefit.
   */
  workers?: number;

  /**
   * Specify the logging level, or provide a custom list of log
   * levels that should be logged.
   */
  logLevel?: "silent" | "info" | "debug" | "verbose" | LogLevel[];
}

export interface FirestoreConnectionOptions {
  /**
   * The Firebase project to use.
   */
  project: string;

  /**
   * The path to the service account credentials for connecting
   * to Firestore.
   *
   * Use either `keyfile`, `credentials` or `emulator`. Has the
   * lowest precedence.
   */
  keyfile?: string;

  /**
   * Service account credentials for connecting to Firestore.
   *
   * Use either `keyfile`, `credentials` or `emulator`. Takes
   * precendence over `keyfile`.
   */
  credentials?: Settings["credentials"];

  /**
   * Instead of connecting to a Firestore project, provide the
   * host of the local Firestore emulator to connect to.
   *
   * Use either `keyfile`, `credentials` or `emulator`. Takes
   * precendence over `keyfile` and `credentials`.
   */
  emulator?: string;
}

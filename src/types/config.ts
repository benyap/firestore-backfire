export interface GlobalOptions {
  /**
   * Show verbose log output.
   */
  verbose?: boolean;
}

export interface SharedOptions {
  /**
   * The Firebase project to import/export data from.
   */
  project: string;

  /**
   * The path to service account credentials for connecting to Firestore.
   *
   * Use either `keyfile`, `credentials` or `emulator`.
   */
  keyfile?: string;

  /**
   * Service account credentials for connecting to Firestore. Takes precedence
   * over `keyfile`.
   */
  credentials?: object;

  /**
   * Provide the emulator host to connect to.
   *
   * Takes precendence over the `keyfile` and `credentials`.
   */
  emulator?: string;

  /**
   * You can specify which root collections to import/export by using the
   * `collections` option.
   *
   * If not specified, all available collections will be imported/exported.
   */
  collections?: string[];

  /**
   * You can provide a list of patterns in the form of regular expressions to
   * filter which documents to import/export. If more than one pattern is provided,
   * a document must match at least one pattern to be imported/exported.
   *
   * Patterns provided as a string will be parsed by
   * [regex-parser](https://www.npmjs.com/package/regex-parser).
   */
  patterns?: (string | RegExp)[];

  /**
   * Limit the subcollection depth to import/export. A document in a root
   * collection has a depth of 0. Subcollections from a document in a root
   * collection has a depth of 1, and so on.
   *
   * If not provided, all subcollections are imported/exported.
   */
  depth: number;

  /**
   * Control the number of sub processes that will be used to read/write
   * data from Firestore.
   *
   * If not provided, the maximum concurrency of 10 will be used.
   */
  concurrency: number;

  /**
   * The `--json` option can be specified when importing/exporting from
   * **local files**.  This option indicates to the program to read/parse
   * data in JSON format rather than default `.snapshot` format.
   */
  json?: boolean;

  /**
   * If you are importing or exporting data to a Google Cloud Storage bucket,
   * you must specify the Google Cloud project the bucket belongs to.
   */
  gcsProject?: string;

  /**
   * If you are importing or exporting data to a Google Cloud Storage bucket,
   * you must specify a path to the service account credentials to use in order
   * to read/write data from the bucket.
   *
   * Use either `gcsKeyfile` or `gcsCredentials.
   */
  gcsKeyfile?: string;

  /**
   * If you are importing or exporting data to a Google Cloud Storage bucket,
   * you must specify service account credentials to use in order to read/write
   * data from the bucket.
   *
   * Takes precendence over `gcsKeyfile`.
   */
  gcsCredentials?: object;
}

export interface ExportActionOptions extends SharedOptions {}

export interface ImportActionOptions extends SharedOptions {}

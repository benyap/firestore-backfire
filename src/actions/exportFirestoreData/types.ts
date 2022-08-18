export interface ExportFirestoreDataOptions {
  /**
   * If `true`, print debug level messages and higher.
   */
  debug?: boolean | undefined;

  /**
   * If `true`, print verbose level messages and higher.
   * Takes precendence over {@link debug}.
   */
  verbose?: boolean | undefined;

  /**
   * If `true`, all log messages are supressed.
   * Takes precendence over {@link verbose} and {@link debug}.
   */
  quiet?: boolean | undefined;

  /**
   * Provide a list of document paths to export.
   */
  paths?: string[] | undefined;

  /**
   * Provide a list of regex patterns that a document path
   * must match to be exported.
   */
  match?: RegExp[] | undefined;

  /**
   * Provide a list of regex patterns where a document will
   * NOT be exported if its path matches any of the patterns.
   *
   * This check takes precedence over {@link patterns}, meaning
   * that even if a path is matched by {@link patterns}, it will
   * still be ignored if it matches any of {@link ignore}.
   */
  ignore?: RegExp[] | undefined;

  /**
   * Limit the subcollection depth to export documents from.
   * The root collection has a depth of 0.
   */
  depth?: number | undefined;

  /**
   * Limit the number of documents to export.
   */
  limit?: number | undefined;

  /**
   * Overwrite any existing data at the output path.
   */
  overwrite?: boolean | undefined;

  /**
   * The interval (in seconds) at which update logs are printed.
   */
  update?: number | undefined;

  /**
   * The interval (in ms) at which chunks of paths are dequeued
   * for exploration using the Firestore SDK's `listDocuments()`
   * or `listCollections()` methods.
   * @default 1000
   */
  exploreInterval?: number | undefined;

  /**
   * The chunk size to use when dequeuing paths for exploration.
   * @default 1000
   */
  exploreChunkSize?: number | undefined;

  /**
   * The interval (in ms) at which chunks of document paths are
   * dequeued to be filtered and downloaded from Firestore.
   * @default 2000
   */
  downloadInterval?: number | undefined;

  /**
   * The chunk size to use when dequeueing paths for download.
   * @default 1000
   */
  downloadChunkSize?: number | undefined;
}

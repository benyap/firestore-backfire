export interface ExportFirestoreDataOptions {
  /**
   * Provide a list of paths to export.
   */
  paths?: string[] | undefined;

  /**
   * Provide a list of regex patterns that a document path
   * must match to be exported.
   */
  match?: RegExp[] | undefined;

  /**
   * Provide a list of regex patterns that prevent a document
   * from being exported if its path matches any of the patterns.
   *
   * This check takes precedence over {@link match}, meaning
   * that even if a path is matched by patterns in {@link match},
   * it will still be ignored if it matches any of the patterns
   * in {@link ignore}.
   */
  ignore?: RegExp[] | undefined;

  /**
   * Limit the subcollection depth to export documents from.
   * Documents in the root collection have a depth of 0.
   * If not specified, no limit is applied.
   */
  depth?: number | undefined;

  /**
   * Limit the number of documents to export.
   * If not specified, no limit is applied.
   */
  limit?: number | undefined;

  /**
   * Overwrite any existing data at the output path.
   * Defaults to `false`.
   */
  overwrite?: boolean | undefined;

  /**
   * The interval (in seconds) at which update logs are printed.
   * Update logs are at the `debug` level.
   * @default 5
   */
  update?: number | undefined;

  /**
   * The interval (in milliseconds) at which chunks of paths are
   * dequeued for exploration using Firestore SDK's `listDocuments()`
   * or `listCollections()` methods.
   * @default 10
   */
  exploreInterval?: number | undefined;

  /**
   * The chunk size to use when dequeuing paths for exploration.
   * @default 1000
   */
  exploreChunkSize?: number | undefined;

  /**
   * The interval (in milliseconds) at which chunks of document
   * paths are dequeued to be filtered and downloaded from Firestore.
   * @default 2000
   */
  downloadInterval?: number | undefined;

  /**
   * The chunk size to use when dequeueing paths for download.
   * @default 1000
   */
  downloadChunkSize?: number | undefined;
}

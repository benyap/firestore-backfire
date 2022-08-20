export interface ImportFirestoreDataOptions {
  /**
   * Provide a list of paths where you want to export data from.
   * This can be a collection path (e.g. `emails`), or a path to
   * a document (e.g. `emails/1`). If not specified, all paths
   * will be exported, starting from the root collections.
   */
  paths?: string[] | undefined;

  /**
   * Provide a list of regex patterns that a document path
   * must match to be imported.
   */
  match?: RegExp[] | undefined;

  /**
   * Provide a list of regex patterns that prevent a document
   * from being imported if its path matches any of the patterns.
   *
   * This check takes precedence over {@link match}, meaning
   * that even if a path is matched by patterns in {@link match},
   * it will still be ignored if it matches any of the patterns
   * in {@link ignore}.
   */
  ignore?: RegExp[] | undefined;

  /**
   * Limit the subcollection depth to import documents from.
   * Documents in the root collection have a depth of 0.
   * If not specified, no limit is applied.
   */
  depth?: number | undefined;

  /**
   * Limit the number of documents to import.
   * If not specified, no limit is applied.
   */
  limit?: number | undefined;

  /**
   * Specify how to handle importing documents that would overwrite existing data.
   * - `create` mode log an error when impporting documents that already exist in Firestore, and existing documents will not be modified.
   * - `insert` mode will only import documents that do not exist, and existing documents will not be modified.
   * - `overwrite` mode will import documents that do not exist, and completely overwrite any existing documents.
   * - `merge` mode will import documents that do not exist, and merge existing documents.
   * @default "create"
   */
  mode?: "create" | "insert" | "overwrite" | "merge";

  /**
   * The interval (in seconds) at which update logs are printed.
   * Update logs are at the `debug` level.
   * @default 5
   */
  update?: number | undefined;

  /**
   * The interval (in seconds) at which documents are flushed to Firestore.
   * @default 1
   */
  flush?: number | undefined;

  /**
   * The interval (in milliseconds) at which documents are processed as
   * they stream in from the data source.
   * @default 10
   */
  processInterval?: number | undefined;
}

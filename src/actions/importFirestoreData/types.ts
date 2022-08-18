export interface ImportFirestoreDataOptions {
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
   * Provide a list of document paths to import.
   */
  paths?: string[] | undefined;

  /**
   * Provide a list of regex patterns that a document path
   * must match to be imported.
   */
  match?: RegExp[] | undefined;

  /**
   * Provide a list of regex patterns where a document will
   * NOT be imported if its path matches any of the patterns.
   *
   * This check takes precedence over {@link patterns}, meaning
   * that even if a path is matched by {@link patterns}, it will
   * still be ignored if it matches any of {@link ignore}.
   */
  ignore?: RegExp[] | undefined;

  /**
   * Limit the subcollection depth to import documents from.
   * The root collection has a depth of 0.
   */
  depth?: number | undefined;

  /**
   * Limit the number of documents to import.
   */
  limit?: number | undefined;

  /**
   * Specify how to import data into Firestore. Defaults to `create`.
   *
   * - `create` mode will error when impporting documents that
   *   already exist in Firestore.
   * - `insert` mode will only import documents that do not exist,
   *   and existing documents will not be modified.
   * - `overwrite` mode will import documents that do not exist, and
   *   completely overwrite any existing documents.
   * - `merge` mode will import documents that do not exist, and merge
   *   existing documents.
   * @default "create"
   */
  mode?: "create" | "insert" | "overwrite" | "merge";

  /**
   * The interval (in seconds) at which update logs are printed.
   * @default 5
   */
  update?: number | undefined;

  /**
   * The interval (in seconds) at which documents are flushed to Firestore.
   * @default 1
   */
  flush?: number | undefined;

  /**
   * The interval (in ms) at which documents are processed as they stream
   * in from the data source.
   * @default 10
   */
  processInterval?: number | undefined;
}

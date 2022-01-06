/**
 * Options for connecting to a local source.
 */
export interface LocalStorageSourceOptions {
  type: "local";
  /** The path to the local directory to read or write from. */
  path: string;
}

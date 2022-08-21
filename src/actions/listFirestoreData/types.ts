export interface ListFirestoreDataOptions {
  /**
   * Return a count of the number of documents/collections
   * instead of the paths.
   */
  count?: boolean | undefined;

  /**
   * Limit the number of documents/collections to return.
   * This option is ignored if {@link count} is `true`.
   */
  limit?: number | undefined;
}

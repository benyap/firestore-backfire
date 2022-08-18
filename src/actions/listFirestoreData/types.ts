export interface ListFirestoreDataOptions {
  /**
   * Return a count of the number of documents.
   */
  count?: boolean | undefined;

  /**
   * Limit the number of documents or collections to return.
   * This option is ignored if {@link count} is `true`.
   */
  limit?: number | undefined;
}

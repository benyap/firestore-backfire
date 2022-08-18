export interface GetFirestoreDataOptions {
  /**
   * {@link JSON.stringify()} the output. Pass `true` to
   * use the default indent of `2`, or pass a number to
   * specify the indent amount.
   */
  stringify?: boolean | number | undefined;
}

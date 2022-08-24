/**
 * Split a list of items into two using a predicate function.
 * Returns the list of items that satisfies the predicate first,
 * then the items that did not.
 *
 * @returns `[satisfied, failed]`
 */
export function split<T>(
  list: T[],
  predicate: (item: T, index: number) => boolean
) {
  return list.reduce(
    (result, item, index) => {
      if (predicate(item, index)) result[0].push(item);
      else result[1].push(item);
      return result;
    },
    [[], []] as [T[], T[]]
  );
}

/**
 * Split a list of items into two using a predicate function.
 * Returns the list of items that satisfies the predicate first,
 * then the items that did not.
 *
 * This strict version allows you to use a type predicate to
 * return strictly typed results.
 *
 * @returns `[satisified, failed]`
 */
export function splitStrict<T, A extends T>(
  list: T[],
  predicate: (item: T, index: number) => item is A
) {
  return list.reduce(
    (result, item, index) => {
      if (predicate(item, index)) result[0].push(item);
      else result[1].push(item as Exclude<T, A>);
      return result;
    },
    [[], []] as [A[], Exclude<T, A>[]]
  );
}

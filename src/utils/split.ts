/**
 * Split a list of items into two using a predicate function.
 * Returns the list of items that satisfies the predicate first,
 * then the items that did not.
 *
 * @returns `[satisfied, failed]`
 */
export function split<T>(
  list: T[],
  predicate: (item: T, index: number) => Boolean
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

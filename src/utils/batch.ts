/**
 * Split a list into batches of the specified size.
 *
 * @param items The list of items to batch.
 * @param batchSize The size of each batch.
 */
export function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Distribute a list of items evenly based on the `size` field.
 *
 * @param items The items to distribute.
 * @param numberOfBuckets The number of buckets to distribute items between.
 */
export function distributeEvenlyBySize<T extends { size: number }>(
  items: T[],
  numberOfBuckets: number
): T[][] {
  let buckets: { size: number; items: T[] }[] = [];
  for (let i = 0; i < numberOfBuckets; i++) {
    buckets.push({ size: 0, items: [] });
  }

  for (const item of items) {
    buckets[0].items.push(item);
    buckets[0].size += item.size;
    buckets = buckets.sort((a, b) => a.size - b.size);
  }

  return buckets.map((bucket) => bucket.items);
}

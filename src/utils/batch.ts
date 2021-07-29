/**
 * Split a list of items into batches of the specified size.
 *
 * @param items The list of items to batch.
 * @param batchSize The maximum size of each batch.
 * @returns A list of batches.
 */
export function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize));
  }
  return batches;
}

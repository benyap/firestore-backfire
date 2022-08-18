/**
 * Checks whether a path points to a document.
 * If `false`, the path points to a collection.
 *
 * @param path The path to check.
 */
export function isDocumentPath(path: string): boolean {
  return path.split("/").length % 2 === 0;
}

/**
 * Returns the depth of a collection path.
 * A root level collection is at depth 0.
 *
 * @param path The path to a collection.
 */
export function collectionPathDepth(path: string): number {
  const segments = path.split("/").length;
  if (segments % 2 === 0)
    throw new Error("collection paths must have an odd number of segments");
  return (segments - 1) / 2;
}

/**
 * Returns the depth of a document path.
 * A document in a root level collection is at depth 0.
 *
 * @param path The path to a document.
 */
export function documentPathDepth(path: string): number {
  const segments = path.split("/").length;
  if (segments % 2 === 1)
    throw new Error("document paths must have an even number of segments");
  return segments / 2 - 1;
}

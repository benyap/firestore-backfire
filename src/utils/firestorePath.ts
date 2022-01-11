/**
 * Determine whether a path is to a collection or a document.
 *
 * @param path The path to check.
 */
export function pathType(path: string): "collection" | "document" {
  const segments = path.split("/").length;
  if (segments % 2 === 0) return "document";
  else return "collection";
}

/**
 * Returns the depth of a collection path. A root level collection is at depth 0.
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
 * Returns the depth of a document path. A document in a root level collection is
 * at depth 0.
 *
 * @param path The path to a collection.
 */
export function documentPathDepth(path: string): number {
  const segments = path.split("/").length;
  if (segments % 2 === 1)
    throw new Error("document paths must have an even number of segments");
  return segments / 2 - 1;
}

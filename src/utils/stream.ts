import { NotImplementedError } from "../errors";
import { FileSource, JSONArraySource } from "../sources";

import type { IStorageSource } from "../types";

/**
 * Create a storage source interface based on the given path.
 *
 * @param path The path in the storage source.
 * @param options
 * @returns The storage source.
 */
export function createStorageSource(
  path: string,
  options: { json?: boolean } = {}
): IStorageSource {
  // TODO:
  if (path.startsWith("gs://"))
    throw new NotImplementedError(
      "Google Storage sources (gs://*) are not yet supported."
    );

  // TODO:
  if (path.startsWith("s3://"))
    throw new NotImplementedError("AWS S3 sources (s3://*) are not yet supported.");

  if (options.json) return new JSONArraySource(path);

  return new FileSource(path);
}

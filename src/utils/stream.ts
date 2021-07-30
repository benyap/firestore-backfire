import { NotImplementedError } from "../errors";
import { FileStream, JSONArrayStream } from "../streams";

import type { IWriteStreamHandler } from "../types";

/**
 * Create an output stream where data can be backed up to.
 *
 * @param path The path to write to.
 * @param json Flag for indicating that a JSONArrayStream should be used. Only relevant for file paths.
 * @returns A stream that data can be written to.
 */
export function createOutStream(path: string, json?: boolean): IWriteStreamHandler {
  // TODO:
  if (path.startsWith("gs://"))
    throw new NotImplementedError(
      "Google Storage output paths (gs://*) are not yet supported."
    );

  // TODO:
  if (path.startsWith("s3://"))
    throw new NotImplementedError(
      "AWS S3 output paths (s3://*) are not yet supported."
    );

  if (json) return new JSONArrayStream(path);

  return new FileStream(path);
}

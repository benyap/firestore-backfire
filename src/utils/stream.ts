import { NotImplementedError } from "../errors";
import { FileStream, JSONArrayStream } from "../streams";

import type { Config, IWriteStreamHandler } from "../types";

/**
 * Create an output stream where data can be backed up to.
 *
 * @param path The path to write to.
 * @param config The program configuration.
 * @returns A stream that data can be written to.
 */
export function createOutStream(path: string, config: Config): IWriteStreamHandler {
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

  if (config.json) return new JSONArrayStream(path);

  return new FileStream(path);
}

import { clearDirectory } from "../utils";

import type { Config } from "../types";

/**
 * Clear the local output directory if the path is a local file path.
 *
 * @param config The program configuration.
 * @returns `true` if files or directories were removed.
 */
export function clearLocalOutput(config: Config) {
  if (config.out.startsWith("gs://")) return false;
  if (config.out.startsWith("s3://")) return false;
  return clearDirectory(config.out, { recursive: true });
}

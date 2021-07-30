import { clearDirectory } from "../utils";

/**
 * Clear the local output directory.
 *
 * @param path The output path to clear.
 */
export function clearLocalOutputDirectory(path: string) {
  return clearDirectory(path, { recursive: true });
}

import { existsSync, mkdirSync, MakeDirectoryOptions } from "fs";

/**
 * Create a directory at the specified path. If the directory
 * already exists, no action is taken.
 *
 * @param path The path to create the directory at.
 * @returns True if the directory was created, false otherwise.
 */
export function createDirectory(path: string, options?: MakeDirectoryOptions) {
  if (!existsSync(path)) {
    mkdirSync(path, options);
    return true;
  }
  return false;
}

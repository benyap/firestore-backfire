import { existsSync, mkdirSync } from "fs";

/**
 * Create a directory at the specified path. If the directory
 * already exists, no action is taken.
 *
 * @param path The path to create the directory at.
 * @returns `true` if the directory was created.
 */
export function createDirectory(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
    return true;
  }
  return false;
}

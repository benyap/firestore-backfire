import {
  existsSync,
  mkdirSync,
  MakeDirectoryOptions,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
} from "fs";

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

/**
 * Clears the given directory.
 *
 * @param path The path to clear.
 * @param options.recursive If `true`, all subdirectories will be recursively deleted.
 */
export function clearDirectory(path: string, options: { recursive?: boolean } = {}) {
  const { recursive } = options;

  // Make sure path exists
  if (!existsSync(path)) return false;

  // Read files and remove each file
  readdirSync(path).forEach((filename) => {
    const currentPath = `${path}/${filename}`;

    // If it is a directory, remove it if recursive is true
    if (recursive && statSync(currentPath).isDirectory()) {
      clearDirectory(currentPath, { recursive });
    } else {
      // Otherwise, remove the file
      unlinkSync(currentPath);
    }
  });

  // Remove current directory
  rmdirSync(path);

  return true;
}

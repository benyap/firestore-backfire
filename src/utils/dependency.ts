import { yellow } from "ansi-colors";
import { EError } from "exceptional-errors";

export class MissingPeerDependencyError extends EError {
  constructor(packageName: string, info?: string) {
    if (info) super(`Please install ${yellow(packageName)}: ${info}`);
    else super(`Please install ${yellow(packageName)}`);
  }
}

/**
 * Asserts that the specified dependency is installed.
 * Throws a {@link MissingPeerDependencyError} if not installed.
 */
export function ensureDependencyInstalled(
  packageName: string,
  info?: string,
): void {
  const installed = isDependencyInstalled(packageName);
  if (!installed) {
    throw new MissingPeerDependencyError(packageName, info);
  }
}

/**
 * Checks if the specified dependency is installed.
 */
export function isDependencyInstalled(packageName: string): boolean {
  try {
    require(packageName);
    return true;
  } catch (error) {
    return false;
  }
}

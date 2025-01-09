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
export async function ensureDependencyInstalled(
  packageName: string,
  info?: string,
): Promise<void> {
  const installed = await isDependencyInstalled(packageName);
  if (!installed) {
    throw new MissingPeerDependencyError(packageName, info);
  }
}

/**
 * Checks if the specified dependency is installed.
 */
export async function isDependencyInstalled(
  packageName: string,
): Promise<boolean> {
  try {
    require(packageName);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(`Please use "import" instead.`)
    ) {
      try {
        await import(packageName);
        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }
}

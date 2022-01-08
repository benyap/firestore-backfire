import { bold } from "ansi-colors";

import { MissingPeerDependencyError } from "~/errors";

export async function ensureStorageSourceDependencyInstalled(
  packageName: string,
  name: string
): Promise<void> {
  const installed = await isDependencyInstalled(packageName);
  if (!installed) {
    throw new MissingPeerDependencyError(
      packageName,
      `Please install ${bold(packageName)} to read and write data from ${name}`
    );
  }
}

export async function isDependencyInstalled(name: string): Promise<boolean> {
  try {
    await import(name);
    return true;
  } catch (error: any) {
    return false;
  }
}

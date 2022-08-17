import { yellow } from "ansi-colors";
import { EError } from "exceptional-errors";

export class MissingPeerDependencyError extends EError {
  constructor(packageName: string, info?: string) {
    if (info) super(`Please install ${yellow(packageName)}: ${info}`);
    else super(`Please install ${yellow(packageName)}`);
  }
}

export async function ensureDependencyInstalled(
  packageName: string,
  info?: string
): Promise<void> {
  const installed = await isDependencyInstalled(packageName);
  if (!installed) {
    throw new MissingPeerDependencyError(packageName, info);
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

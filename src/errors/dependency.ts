import { bold } from "ansi-colors";

import { BackfireError } from "./base";

/**
 * This error is thrown when a peer dependency that is used by
 * an opt-in feature has not been installed.
 */
export class MissingPeerDependencyError extends BackfireError {
  constructor(
    public readonly dependency: string,
    details: string = `Please install ${bold(dependency)} to use this feature`
  ) {
    super(`missing peer depedency "${dependency}"`, details);
  }
}

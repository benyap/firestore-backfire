import { ErrorWithDetails } from "./base";

export class ConfigError extends ErrorWithDetails {}

export class ConfigNotFoundError extends ConfigError {
  constructor() {
    super(
      "Configuration file not found.",
      `Please provide configuration in one of the following places:
  - package.json > firebasebackup
  - .firebasebackuprc
  - .firebasebackuprc.json
  - .firebasebackuprc.yaml
  - .firebasebackuprc.yml
  - .firebasebackuprc.js
  - .firebasebackuprc.config.js
`
    );
  }
}

export class InvalidOutputPathError extends ConfigError {
  constructor(public readonly path: string, message?: string, details?: string) {
    super(message ?? `Invalid output path provided: ${path}`, details);
  }
}

export class UnsupportedOutputPathProtocolError extends InvalidOutputPathError {
  constructor(public readonly protocol: string, path: string) {
    super(path, `The file protocol ${protocol}://* is currently not supported.`);
  }
}

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

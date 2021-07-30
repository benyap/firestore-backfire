import { Constants } from "../config";

import { ErrorWithDetails } from "./base";

export class ConfigError extends ErrorWithDetails {}

export class ConfigNotFoundError extends ConfigError {
  constructor() {
    super(
      "Configuration file not found.",
      `Please provide configuration in one of the following places:
  - package.json > ${Constants.NAME}
  - .${Constants.NAME}rc
  - .${Constants.NAME}rc.json
  - .${Constants.NAME}rc.yaml
  - .${Constants.NAME}rc.yml
  - .${Constants.NAME}rc.js
  - .${Constants.NAME}rc.config.js
`
    );
  }
}

export class UnsupportedOutputProtocolError extends ConfigError {
  constructor(public readonly protocol: string) {
    super(`The file protocol ${protocol}://* is currently not supported.`);
  }
}

import { ConfigError } from "../errors";

import type { SharedOptions } from "../types";

export function validateExportCredentials(options: SharedOptions) {
  if (!options.emulator && !options.keyfile) {
    throw new ConfigError(
      "Either --keyfile or --emulator is required.",
      `Please provide either:
  - a path to the service account credentials file for the project "${options.project}" using --keyfile option, or
  - the emulator host (e.g. localhost:8080) if using Firebase Emulator using the --emulator option`
    );
  }
}

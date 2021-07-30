import { ConfigError } from "../errors";
import { ExportOptions } from "../types";

export function validateExportCredentials(project: string, config: ExportOptions) {
  if (!config.emulator && !config.keyfile) {
    throw new ConfigError(
      "Either --keyfile or --emulator is required.",
      `Please provide either:
  - a path to the service account credentials file for the project "${project}" using --keyfile option, or
  - the emulator host (e.g. localhost:8080) if using Firebase Emulator using the --emulator option`
    );
  }
}

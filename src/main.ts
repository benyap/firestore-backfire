import { ConfigError, ErrorWithDetails } from "./errors";
import { LoggingService } from "./logger";
import { LogLevel } from "./types";

import {
  createProgram,
  getConfig,
  getOptions,
  createCredentials,
  createDirectory,
  createFirestore,
  runBackup,
} from "./tasks";

async function main() {
  // Create program for parsing command line arguments
  const program = createProgram();

  // Merge config from configuration and command line
  // Command line options take priority
  const config = {
    ...(await getConfig()),
    ...getOptions(program),
  };

  // Create logger
  const logger = LoggingService.create(
    "main",
    config.verbose
      ? [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
      : undefined
  );

  logger.debug("Parsed configuration", config);

  // Ensure keyfile is present if not using emulator
  if (!config.emulator && !config.keyfile) {
    throw new ConfigError(
      "Either --keyfile or --emulator is required.",
      `Please provide either:
  - a path to the service account credentials to the project "${config.project}" using --keyfile option, or
  - the emulator host (e.g. localhost:8080) if using Firebase Emulator using the --emulator option`
    );
  }

  // Connect to Firestore
  const credentials = createCredentials(config);
  const firestore = createFirestore(config.project, credentials);
  logger.info(`Connected to Firestore for "${config.project}"`);

  // Create directory for output
  const created = createDirectory(config.out, { recursive: true });
  if (created) logger.debug(`Created output directory ${config.out}`);

  // Create backup files
  await runBackup(firestore, config);
}

// Run program
main().catch((error) => {
  const logger = LoggingService.create("root");
  if (error instanceof ErrorWithDetails)
    logger.error(error.message + "\n\n" + (error.details ?? "") + "\n");
  else logger.error(error.message, error);
});

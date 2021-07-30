import { Command } from "commander";

import { Constants } from "./config";
import { ErrorWithDetails } from "./errors";
import { LoggingService } from "./logger";
import { validateMinMaxInteger } from "./utils";
import { getGlobalOptions } from "./tasks";

import { exportAction } from "./actions";

import { ExportOptions } from "./types";

async function main() {
  // Create program for parsing command line arguments
  const program = new Command()
    .version(Constants.VERSION)
    .name(Constants.MODULE_NAME);

  // Define global options
  program.option("--verbose", "output verbose logs");

  // Define export command
  program
    .command("export <project>", { isDefault: true })
    .description("export data from Firestore")
    .requiredOption("-o, --out <path>", "path to output directory")
    .option("-k, --keyfile <path>", "path to account credentials JSON file")
    .option("--emulator <host>", "back up data from Firestore emulator")
    .option(
      "--collections [collections...]",
      "name of the root collections to back up (all collections backed up if not specified)"
    )
    .option(
      "--patterns [regex...]",
      "regex patterns that a document path must match to be backed up"
    )
    .option(
      "--concurrency <number>",
      "number of concurrent processes allowed",
      (value: string, _) =>
        validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY),
      Constants.MAX_CONCURRENCY
    )
    .option(
      "--depth <number>",
      "subcollection depth to back up",
      (value: string, _) => validateMinMaxInteger(value, 0, Constants.MAX_DEPTH),
      Constants.MAX_DEPTH
    )
    .option(
      "--json",
      "outputs data in JSON array format (only applies to local file streams)"
    )
    .action(async (projectId: string, options: ExportOptions) => {
      const globalOptions = await getGlobalOptions(program);
      await exportAction(projectId, options, globalOptions);
    });

  await program.parseAsync();
}

// Run program
main().catch((error) => {
  const logger = LoggingService.create("root");
  if (error instanceof ErrorWithDetails)
    logger.error(error.message + "\n\n" + (error.details ?? "") + "\n");
  else logger.error(error.message, error);
});

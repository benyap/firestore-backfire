#! /usr/bin/env node

import { Command } from "commander";

import { Constants } from "./config";
import { ErrorWithDetails } from "./errors";
import { LoggingService } from "./logger";
import { validateMinMaxInteger } from "./utils";
import { getGlobalOptions } from "./tasks";
import { exportAction, importAction } from "./actions";

import type { ExportOptions, ImportOptions } from "./types";

async function main() {
  // Create program for parsing command line arguments
  const program = new Command()
    .version(Constants.VERSION)
    .name(Constants.NAME)
    .description(Constants.DESCRIPTION);

  // Define global options
  program.option("--verbose", "output verbose logs");

  // Define export command
  program
    .command("export <path>", { isDefault: true })
    .description("Export data from Firestore to the given path")
    .option("-P, --project <project>", "the Firebase project id")
    .option("-K, --keyfile <path>", "path to account credentials JSON file")
    .option("-E, --emulator <host>", "use the local Firestore emulator")
    .option(
      "--collections [collections...]",
      "name of the root collections to export (all collections exported if not specified)"
    )
    .option(
      "--patterns [regex...]",
      "regex patterns that a document path must match to be exported"
    )
    .option(
      "--depth <number>",
      "subcollection depth to export",
      (value: string, _) => validateMinMaxInteger(value, 0, Constants.MAX_DEPTH),
      Constants.MAX_DEPTH
    )
    .option(
      "--concurrency <number>",
      "number of concurrent processes allowed",
      (value: string, _) =>
        validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY),
      Constants.MAX_CONCURRENCY
    )
    .option(
      "--json",
      "outputs data in JSON array format (only applies when exporting to local files)"
    )
    .action(async (path: string, options: ExportOptions) => {
      const globalOptions = await getGlobalOptions(program);
      const allOptions = { ...globalOptions, ...options };
      await exportAction(path, allOptions);
    });

  // Define import command
  program
    .command("import <path>")
    .description("Import data to Firestore from the given path")
    .option("-P, --project <project>", "the Firebase project id")
    .option("-K, --keyfile <path>", "path to service account credentials JSON file")
    .option("-E, --emulator <host>", "use the local Firestore emulator")
    .option(
      "--collections [collections...]",
      "name of the root collections to import (all collections imported if not specified)"
    )
    .option(
      "--patterns [regex...]",
      "regex patterns that a document path must match to be imported"
    )
    .option(
      "--depth <number>",
      "subcollection depth to import",
      (value: string, _) => validateMinMaxInteger(value, 0, Constants.MAX_DEPTH),
      Constants.MAX_DEPTH
    )
    .option(
      "--concurrency <number>",
      "number of concurrent processes allowed",
      (value: string, _) =>
        validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY),
      Constants.MAX_CONCURRENCY
    )
    .action(async (path: string, options: ImportOptions) => {
      const globalOptions = await getGlobalOptions(program);
      const allOptions = { ...globalOptions, ...options };
      await importAction(path, allOptions);
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

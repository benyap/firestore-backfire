#! /usr/bin/env node

import { Command } from "commander";

import { Constants, Options } from "./config";
import { ErrorWithDetails } from "./errors";
import { LoggingService } from "./logger";
import { getGlobalOptions } from "./tasks";
import { exportAction, importAction } from "./actions";

import type { ExportActionOptions, ImportActionOptions } from "./types";

async function main() {
  // Create program for parsing command line arguments
  const program = new Command()
    .version(Constants.VERSION)
    .name(Constants.NAME)
    .description(Constants.DESCRIPTION);

  // Define global options
  Options.GLOBAL.forEach((option) => program.addOption(option));

  // Define export command
  const exportCommand = program
    .command("export <path>", { isDefault: true })
    .description("Export data from Firestore to the given path");
  Options.FIREBASE.forEach((option) => exportCommand.addOption(option));
  Options.EXPORT.forEach((option) => exportCommand.addOption(option));
  Options.GCS.forEach((option) => exportCommand.addOption(option));

  exportCommand.action(async (path: string, options: ExportActionOptions) => {
    const globalOptions = await getGlobalOptions(program);
    const allOptions = { ...globalOptions, ...options };
    await exportAction(path, allOptions);
  });

  // Define import from file command
  const importCommand = program
    .command("import <path>")
    .description("Import data to Firestore from the given path");
  Options.FIREBASE.forEach((option) => importCommand.addOption(option));
  Options.IMPORT.forEach((option) => importCommand.addOption(option));
  Options.GCS.forEach((option) => importCommand.addOption(option));

  importCommand.action(async (path: string, options: ImportActionOptions) => {
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

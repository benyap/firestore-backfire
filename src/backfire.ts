#! /usr/bin/env node

import { Command, Option } from "commander";

import { Logger } from "./utils";
import { Constants } from "./config";
import { BackfireError } from "./errors";
import { createExportCommand, createImportCommand } from "./cli";

async function main() {
  // Create program for parsing CLI commands
  const cli = new Command()
    .name(Constants.NAME)
    .version(Constants.VERSION)
    .description(Constants.DESCRIPTION);

  // Add global options
  cli.addOption(new Option("-c, --config <path>", "specify the config file to use"));
  const globalOptions = cli.opts();

  // Create commands
  createExportCommand(cli, globalOptions);
  createImportCommand(cli, globalOptions);

  // Execute program
  await cli.parseAsync();
}

// Run program
main().catch(async (error) => {
  const logger = Logger.create(Constants.NAME);
  if (error instanceof BackfireError) {
    if (error.details) logger.error(error.message + "\n\n" + error.details + "\n");
    else logger.error(error.message);
  } else logger.error(error.message, error);
});

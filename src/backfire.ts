#! /usr/bin/env node

import { Command } from "commander";
import { EError } from "exceptional-errors";

import { Logger } from "./utils";
import { Constants, GlobalOptions } from "./config";
import {
  ConfigOption,
  createGetCommand,
  createListCommand,
  createExportCommand,
  createImportCommand,
} from "./cli";

async function main() {
  // Create program for parsing CLI commands
  const cli = new Command()
    .name(Constants.NAME)
    .version(Constants.VERSION)
    .description(Constants.DESCRIPTION);

  // Add global options
  cli.addOption(ConfigOption());
  const globalOptions = cli.opts<GlobalOptions>();

  // Create commands
  createGetCommand(cli, globalOptions);
  createListCommand(cli, globalOptions);
  createExportCommand(cli, globalOptions);
  createImportCommand(cli, globalOptions);

  // Execute program
  await cli.parseAsync();
}

main().catch(async (error) => {
  const logger = Logger.create(Constants.NAME);
  if (error instanceof EError) {
    if (error.info) logger.error(String(error), error.info);
    else logger.error(String(error));
  } else {
    logger.error(error);
  }
});

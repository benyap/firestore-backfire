#! /usr/bin/env node

import { EError } from "exceptional-errors";

import { Logger } from "./utils";
import { Constants, GlobalOptions } from "./config";

async function main() {
  // Only import CLI dependencies when invoked via this function
  const { Command, Option } = await import("commander");
  const { createGetCommand, createListCommand, createExportCommand } =
    await import("./cli");

  // Create program for parsing CLI commands
  const cli = new Command()
    .name(Constants.NAME)
    .version(Constants.VERSION)
    .description(Constants.DESCRIPTION);

  // Add global options
  cli.addOption(
    new Option("-c, --config <path>", "specify the config file to use")
  );
  const globalOptions = cli.opts<GlobalOptions>();

  // Create commands
  createGetCommand(cli, globalOptions);
  createListCommand(cli, globalOptions);
  createExportCommand(cli, globalOptions);

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

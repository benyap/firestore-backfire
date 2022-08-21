#! /usr/bin/env node

import { Command } from "commander";
import { EError } from "exceptional-errors";

import { capitalize, Logger } from "./utils";
import { Constants, GlobalOptions } from "./config";
import {
  ConfigOption,
  createGetCommand,
  createListCommand,
  createExportCommand,
  createImportCommand,
} from "./cli";

const logger = Logger.create(Constants.NAME);

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

  // Configure how to output error messages
  cli.configureOutput({
    writeErr(message) {
      const messages = message.split("\n");
      if (!messages.at(-1)) messages.splice(-1); // remove last line if empty
      messages
        .map((message) => capitalize(message.replace(/^error: /gi, "")))
        .forEach((message) => logger.error(message));
    },
  });

  // Execute program
  await cli.parseAsync();
}

main().catch(async (error) => {
  if (error instanceof EError) {
    if (error.info) logger.error(String(error), error.info);
    else logger.error(String(error));
  } else {
    logger.error(error);
  }
});

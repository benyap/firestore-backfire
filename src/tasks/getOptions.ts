import { Command } from "commander";

import type { Config } from "../types";

/**
 * Parses the configuration provided from CLI options.
 *
 * @param program The CLI program.
 * @returns The configuration parsed from the CLI arguments.
 */
export function getOptions(program: Command) {
  program.parse();
  return program.opts() as Config;
}

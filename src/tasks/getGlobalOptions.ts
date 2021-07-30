import { Command } from "commander";
import { cosmiconfig } from "cosmiconfig";

import { Constants } from "../config";

import type { GlobalOptions } from "../types";

/**
 * Get the global options to use by merging options provided by
 * a config file with CLI arguments provided by the program.
 *
 * CLI arguments take precedence over config file options.
 *
 * @param program The program with parsed options.
 * @returns The merged global configuration.
 */
export async function getGlobalOptions(program: Command) {
  return {
    ...(await getGlobalOptionsFromFile()),
    ...program.opts(),
  } as GlobalOptions;
}

/**
 * Read options from a config file if it exists.
 *
 * @returns The configuration from a config file.
 */
export async function getGlobalOptionsFromFile() {
  const explorer = cosmiconfig(Constants.NAME);
  const result = await explorer.search();
  return (result?.config as GlobalOptions) ?? {};
}

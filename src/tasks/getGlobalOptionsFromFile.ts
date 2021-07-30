import { cosmiconfig } from "cosmiconfig";

import { Constants } from "../config";

import type { GlobalOptions } from "../types";

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

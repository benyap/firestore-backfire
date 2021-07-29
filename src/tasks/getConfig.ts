import { cosmiconfig } from "cosmiconfig";

import { Constants } from "../config";
// import { ConfigNotFoundError } from "../errors";

import type { Config } from "../types";

/**
 * Read the config from a config file.
 *
 * @returns The configuration from a config file.
 */
export async function getConfig() {
  const explorer = cosmiconfig(Constants.MODULE_NAME);
  const result = await explorer.search();
  // if (!result) throw new ConfigNotFoundError();
  return result?.config as Config | null;
}

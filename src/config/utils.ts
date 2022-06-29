import { cosmiconfig } from "cosmiconfig";

import { FirestoreConnectionOptions } from "~/services";
import { FirestoreDataOptions } from "~/actions/types";

import { NAME } from "./constants";

export type GlobalOptions = {
  /**
   * Path to the configuration file to use.
   */
  config?: string;
};

export type ResolvedConfig = {
  connection: FirestoreConnectionOptions;
  data: FirestoreDataOptions;
};

/**
 * Get the configuration from a configuration file.
 */
export async function loadConfig(
  path?: string
): Promise<FirestoreConnectionOptions & FirestoreDataOptions> {
  const explorer = cosmiconfig(NAME);
  const result = path ? await explorer.load(path) : await explorer.search();
  return result?.config;
}

/**
 * Iterate through the properties in the first object and return
 * the value if found. Otherwise, iterate through the second object
 * and return the value if found. Otherwise, return empty.
 */
function greedyPick<T, K extends keyof T>(
  first: T,
  second: T,
  ...keys: K[]
): { key: K; value: T[K] } | { key?: never; value?: never } {
  for (const key of keys) {
    if (first[key]) return { key, value: first[key] };
  }
  for (const key of keys) {
    if (second[key]) return { key, value: second[key] };
  }
  return {};
}

/**
 * Resolve the final configuration to use from options passed through
 * the CLI, configuration file and environment variables.
 */
export async function resolveConfig(
  globalOptions: GlobalOptions,
  cliOptions: FirestoreConnectionOptions & FirestoreDataOptions
): Promise<ResolvedConfig> {
  const config: ResolvedConfig = { connection: {}, data: {} };

  const configOptions = await loadConfig(globalOptions.config);

  // Allow a keyfile to be specified through GOOGLE_APPLICATION_CREDENTIALS
  if (!configOptions.keyfile && process.env["GOOGLE_APPLICATION_CREDENTIALS"])
    configOptions.keyfile = process.env["GOOGLE_APPLICATION_CREDENTIALS"];

  const { value: project } = greedyPick(cliOptions, configOptions, "project");
  if (project) config.connection.project = project;

  const { key: connectionKey, value: connection } = greedyPick(
    cliOptions,
    configOptions,
    "emulator",
    "credentials",
    "keyfile"
  );
  if (connectionKey) config.connection[connectionKey] = connection as any;

  const { value: paths } = greedyPick(cliOptions, configOptions, "paths");
  if (paths) config.data.paths = paths;

  return config;
}

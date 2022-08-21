import { cosmiconfig } from "cosmiconfig";

import { FirestoreConnectionOptions } from "~/firestore";
import { ActionOptions } from "~/actions/types";
import { DataSourceOptions } from "~/data-source/interface";

import { NAME } from "./constants";

export type GlobalOptions = {
  /**
   * Path to the configuration file to use.
   */
  config?: string;
};

export type ResolvedConfig = {
  connection: FirestoreConnectionOptions;
  action: ActionOptions;
  dataSource: DataSourceOptions;
};

type AllOptions = FirestoreConnectionOptions &
  ActionOptions &
  DataSourceOptions;

/**
 * Get the configuration from a configuration file.
 */
export async function loadConfig(path?: string): Promise<AllOptions> {
  const explorer = cosmiconfig(NAME);
  const result = path ? await explorer.load(path) : await explorer.search();
  return result?.config ?? {};
}

/**
 * Returns a function that can be used to select the first
 * defined value from a list of keys from the first object.
 * If none of the keys are defined in the first object, the
 * value will be selected from the second object.
 *
 * If neither object has the keys we are looking for, an
 * empty object is returned.
 */
function greedyPick<T>(first: T, second: T) {
  return <K extends keyof T>(
    ...keys: K[]
  ): { key: K; value: T[K] } | { key?: never; value?: never } => {
    for (const key of keys) {
      if (typeof first[key] !== "undefined") {
        return { key, value: first[key] };
      }
    }
    for (const key of keys) {
      if (typeof second[key] !== "undefined") {
        return { key, value: second[key] };
      }
    }
    return {};
  };
}

/**
 * Resolve the final configuration to use from options passed through
 * the CLI, configuration file and environment variables.
 */
export async function resolveConfig(
  globalOptions: GlobalOptions,
  cliOptions: AllOptions
): Promise<ResolvedConfig> {
  const config: ResolvedConfig = {
    connection: {},
    action: {},
    dataSource: {},
  };

  const configOptions = await loadConfig(globalOptions.config);

  // Set up a selector that will pick options from the CLI first, then fallback to config file options
  const pick = greedyPick(cliOptions, configOptions);

  //
  // Connection options
  //

  const { value: project } = pick("project");
  const { key: connectionKey, value: connection } = pick(
    "emulator",
    "credentials",
    "keyFile"
  );

  if (project) config.connection.project = project;
  if (connectionKey) config.connection[connectionKey] = connection as any;

  //
  // Data options
  //

  config.action.stringify = pick("stringify").value;
  config.action.count = pick("count").value;
  config.action.limit = pick("limit").value;
  config.action.debug = pick("debug").value;
  config.action.verbose = pick("verbose").value;
  config.action.quiet = pick("quiet").value!;
  config.action.update = pick("update").value!;
  config.action.paths = pick("paths").value!;
  config.action.match = pick("match").value!;
  config.action.ignore = pick("ignore").value!;
  config.action.depth = pick("depth").value!;
  config.action.overwrite = pick("overwrite").value!;
  config.action.mode = pick("mode").value!;

  //
  // Data source options
  //

  config.dataSource.gcpProject = pick("gcpProject").value;
  config.dataSource.gcpKeyFile = pick("gcpKeyFile").value;
  config.dataSource.gcpCredentials = pick("gcpCredentials").value;
  config.dataSource.awsRegion = pick("awsRegion").value;
  config.dataSource.awsProfile = pick("awsProfile").value;
  config.dataSource.awsAccessKeyId = pick("awsAccessKeyId").value;
  config.dataSource.awsSecretAccessKey = pick("awsSecretAccessKey").value;

  return config;
}

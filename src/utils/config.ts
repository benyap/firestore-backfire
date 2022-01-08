import { cosmiconfig } from "cosmiconfig";
import parseRegex from "regex-parser";

import { Constants } from "~/config";
import { pathType } from "~/cli/helpers";
import { S3StorageSourceOptions } from "~/services/StorageSourceService/s3";
import { ExportFirestoreDataOptions, ImportFirestoreDataOptions } from "~/actions";

export async function loadConfig(path?: string) {
  const explorer = cosmiconfig(Constants.NAME);
  const result = path ? await explorer.load(path) : await explorer.search();
  return result?.config;
}

export interface GlobalOptions {
  /**
   * Path to the configuration file to use.
   */
  config?: string;
}

type Options = ExportFirestoreDataOptions | ImportFirestoreDataOptions;

export function resolveConfig<T extends Options>(
  path: string | undefined,
  commandLineOptions: Partial<T> = {},
  configOptions: Partial<T> = {}
) {
  const config: Partial<T> = {
    path: "",
    project: "",
    type: "unknown" as const,
    ...configOptions,
    ...commandLineOptions,
  };

  // Make sure command line options take priority
  if (path) config.path = path;
  if (config.path) config.type = pathType(config.path);

  const { keyfile: cliKeyfile, emulator: cliEmulator } = commandLineOptions;
  const { emulator: configEmulator } = configOptions;

  // Allow command line keyfile to take precedence over config emulator
  if (cliKeyfile && !cliEmulator && configEmulator) {
    delete config.emulator;
  }

  if (config.type === "s3") {
    const {
      awsProfile: cliProfile,
      awsAccessKeyId: cliKey,
      awsSecretAccessKey: cliSecret,
    } = commandLineOptions as S3StorageSourceOptions;

    const { awsAccessKeyId: configKey, awsSecretAccessKey: configSecret } =
      configOptions as S3StorageSourceOptions;

    // Allow command line profile to take precendence over config AWS keys
    if (cliProfile && !cliKey && !cliSecret && configKey && configSecret) {
      delete (config as S3StorageSourceOptions).awsAccessKeyId;
      delete (config as S3StorageSourceOptions).awsSecretAccessKey;
    }
  }

  // Transform path patterns from strings into RegExp
  if (config.patterns) {
    config.patterns = config.patterns.map((pattern: string | RegExp) =>
      typeof pattern === "string" ? parseRegex(pattern) : pattern
    );
  }

  return config as T;
}

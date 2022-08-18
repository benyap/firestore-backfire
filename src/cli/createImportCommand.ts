import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import { dataSourceFactory } from "~/data-source/factory";
import { importFirestoreData } from "~/actions/importFirestoreData";

import {
  KeyFileOption,
  EmulatorOption,
  DebugOption,
  VerboseOption,
  QuietOption,
  ProjectOption,
  PathsOption,
  MatchOption,
  IgnoreOption,
  DepthOption,
  GcpProjectOption,
  GcpKeyFileOption,
  AwsRegionOption,
  AwsProfileOption,
  AwsAccessKeyIdOption,
  AwsSecretAccessKeyOption,
  WriteModeOption,
  UpdateRateOption,
  LimitOption,
} from "./options";

export function createImportCommand(
  cli: Command,
  globalOptions: GlobalOptions
) {
  cli
    .command("import <path>")
    .description("import data into Firestore")
    // Connection options
    .addOption(ProjectOption({ action: "import" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    // Action options
    .addOption(PathsOption({ action: "import" }))
    .addOption(MatchOption({ action: "import" }))
    .addOption(IgnoreOption())
    .addOption(DepthOption({ action: "import" }))
    .addOption(LimitOption({ action: "import" }))
    .addOption(WriteModeOption())
    .addOption(DebugOption())
    .addOption(VerboseOption())
    .addOption(QuietOption())
    .addOption(UpdateRateOption())
    // Google Cloud Storage data source options
    .addOption(GcpProjectOption())
    .addOption(GcpKeyFileOption())
    // S3 data source options
    .addOption(AwsRegionOption())
    .addOption(AwsProfileOption())
    .addOption(AwsAccessKeyIdOption())
    .addOption(AwsSecretAccessKeyOption())
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, dataSource, action } = config;
      const reader = await dataSourceFactory.createReader(path, dataSource);
      await importFirestoreData(connection, reader, action);
    });
}

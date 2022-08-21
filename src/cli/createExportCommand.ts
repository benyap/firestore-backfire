import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import { dataSourceFactory } from "~/data-source/factory";
import { exportFirestoreData } from "~/actions/exportFirestoreData";

import {
  KeyFileOption,
  EmulatorOption,
  OverwriteOption,
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
  UpdateRateOption,
  LimitOption,
} from "./options";

export function createExportCommand(
  cli: Command,
  globalOptions: GlobalOptions
) {
  cli
    .command("export <path>")
    .description("export data from Firestore")
    // Connection options
    .addOption(ProjectOption({ action: "export" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    // Action options
    .addOption(PathsOption({ action: "export" }))
    .addOption(MatchOption({ action: "export" }))
    .addOption(IgnoreOption())
    .addOption(DepthOption({ action: "export" }))
    .addOption(LimitOption())
    .addOption(OverwriteOption())
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
    // Action handler
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, dataSource, action } = config;
      const writer = await dataSourceFactory.createWriter(path, dataSource);
      await exportFirestoreData(connection, writer, action);
    });
}

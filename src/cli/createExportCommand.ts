import { Command } from "commander";

import { CliParser } from "~/utils";
import { resolveConfig, GlobalOptions } from "~/config";
import { dataSourceFactory } from "~/data-source/factory";
import { exportFirestoreData } from "~/actions/exportFirestoreData";

export function createExportCommand(
  cli: Command,
  globalOptions: GlobalOptions
) {
  cli
    .command("export <path>")
    .description("export data from Firestore")
    .option(
      "-p, --project <project>",
      "the Firebase project to export data from"
    )
    .option(
      "-k, --keyfile <path>",
      "path to Firebase service account credentials file"
    )
    .option(
      "-e, --emulator <host>",
      "export data from Firestore emulator if provided"
    )
    .option("--paths <path...>", "specify the paths to export data from")
    .option(
      "--match <pattern...>",
      "specify regex patterns that a document path must match to be exported"
    )
    .option(
      "--ignore <pattern...>",
      "specify regex patterns that will ignore a document if its path matches (takes precedence over --match)"
    )
    .option(
      "--depth <number>",
      "subcollection depth to export (root collection has depth of 0, all subcollections exported if not specified)",
      CliParser.integer({ min: 0, max: 100 })
    )
    .option("--overwrite", "overwrite any existing data at the output path")
    .option("--debug", "print debug level logs")
    .option("--verbose", "print verbose level logs")
    .option("--quiet", "silence all logs")
    // Google Cloud Storage data source options
    .option(
      "--gcpProject <projectId>",
      "used with Google Cloud Storage data source"
    )
    .option("--gcpKeyFile <path>", "used with Google Cloud Storage data source")
    // S3 data source options
    .option("--awsRegion <region>", "used with S3 data source")
    .option("--awsProfile <profile>", "used with S3 data source")
    .option("--awsAccessKeyId <value>", "used with S3 data source")
    .option("--awsSecretAccessKey <value>", "used with S3 data source")
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, dataSource, action } = config;
      const writer = await dataSourceFactory.createWriter(path, dataSource);
      await exportFirestoreData(connection, writer, action);
    });
}

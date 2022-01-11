import { Command, Option } from "commander";

import { exportFirestoreData } from "~/actions";
import { GlobalOptions, loadConfig, resolveConfig } from "~/utils";

import { isBetween, isInteger } from "./helpers";

export function createExportCommand(
  cli: Command,
  globalOptions: GlobalOptions = {}
) {
  cli
    .command("export [path]", { isDefault: true })
    .description("export data from Firestore")
    .addOption(
      new Option(
        "-p, --project <project>",
        "the Firebase project to export data from"
      )
    )
    .addOption(
      new Option(
        "-k, --keyfile <path>",
        "path to Firebase service account credentials JSON file"
      )
    )
    .addOption(
      new Option(
        "-e, --emulator <host>",
        "export data from Firestore emulator if provided"
      )
    )
    .addOption(
      new Option(
        "--paths <path...>",
        "specify paths to export (all paths exported if not specified)"
      )
    )
    .addOption(
      new Option(
        "--patterns <pattern...>",
        "specify regex patterns that a document path must match to be exported"
      )
    )
    .addOption(
      new Option(
        "--depth <number>",
        "subcollection depth to export (root collection has depth of 0, all subcollections exported if not specified)"
      ).argParser((value: string) =>
        isBetween(isInteger(value, "depth"), 0, 100, "depth")
      )
    )
    .addOption(
      new Option(
        "--workers <number>",
        "number of worker threads to use (determines number of export chunks, defaults to number of logical CPU cores available)"
      ).argParser((value: string) =>
        isBetween(isInteger(value, "workers"), 0, 64, "workers")
      )
    )
    .addOption(
      new Option("--logLevel <level>", "specify the logging level").choices([
        "silent",
        "info",
        "debug",
        "verbose",
      ])
    )
    .addOption(new Option("--prettify", "prettify the output JSON"))
    .addOption(
      new Option("--force", "overwrite any existing data in the write location")
    )
    .addOption(
      new Option(
        "--gcpProject <project_id>",
        "the Google Cloud project to import data from"
      )
    )
    .addOption(
      new Option(
        "--gcpKeyfile <path>",
        "path to Google Cloud service account credentials JSON file"
      )
    )
    .addOption(new Option("--awsRegion <region>", "the AWS region to use"))
    .addOption(new Option("--awsProfile <profile>", "the AWS profile to use"))
    .addOption(new Option("--awsAccessKeyId <value>", "the AWS access key id"))
    .addOption(
      new Option("--awsSecretAccessKey <value>", "the AWS secret access key")
    )
    .action(async (path: string | undefined, options: any) => {
      const config = await loadConfig(globalOptions.config);
      await exportFirestoreData(resolveConfig(path, options, config));
    });
}

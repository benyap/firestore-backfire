import { Command, Option } from "commander";

import { importFirestoreData } from "~/actions";
import { GlobalOptions, loadConfig, resolveConfig } from "~/utils";

import { isBetween, isInteger } from "./helpers";

export function createImportCommand(
  cli: Command,
  globalOptions: GlobalOptions = {}
) {
  cli
    .command("import [path]")
    .description("import data into Firestore")
    .addOption(
      new Option(
        "-p, --project <project_id>",
        "the Firebase project to import data to"
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
        "import data into Firestore emulator if provided"
      )
    )
    .addOption(
      new Option(
        "--paths <path...>",
        "specify paths to import (all paths imported if not specified)"
      )
    )
    .addOption(
      new Option(
        "--patterns <pattern...>",
        "specify regex patterns that a document path must match to be imported"
      )
    )
    .addOption(
      new Option(
        "--depth <number>",
        "subcollection depth to import (root collection has depth of 0, all subcollections imported if not specified)"
      ).argParser((value: string) =>
        isBetween(isInteger(value, "depth"), 0, 100, "depth")
      )
    )
    .addOption(
      new Option(
        "--workers <number>",
        "number of worker threads to use (defaults to number of data chunks to read)"
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
    .addOption(
      new Option(
        "--mode <write_mode>",
        "specify whether importing existing documents should be throw an error, be merged or overwritten"
      ).choices(["create", "create-and-skip-existing", "merge", "overwrite"])
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
      await importFirestoreData(resolveConfig(path, options, config));
      process.exit();
    });
}

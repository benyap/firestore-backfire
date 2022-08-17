import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import { exportFirestoreData } from "~/actions/exportFirestoreData";
import { FileDataOutput } from "~/data-source/file";
import { CLIParser } from "~/utils";

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
      CLIParser.integer({ min: 0, max: 100 })
    )
    .option("--debug", "print debug level logs")
    .option("--verbose", "print verbose level logs")
    .option("--quiet", "silence all logs")
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = new FileDataOutput(path);
      await exportFirestoreData(config.connection, output, options);
    });
}

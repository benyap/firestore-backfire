import { Command } from "commander";

import { CliParser } from "~/utils";
import { resolveConfig, GlobalOptions } from "~/config";
import { getFirestoreData } from "~/actions/getFirestoreData";

export function createGetCommand(cli: Command, globalOptions: GlobalOptions) {
  cli
    .command("get <path>")
    .description("get a document from Firestore")
    .option(
      "--stringify [indent]",
      "JSON.stringify the output",
      CliParser.integer()
    )
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, action } = config;
      const output = await getFirestoreData(connection, path, action as any);
      console.log(output);
    });
}

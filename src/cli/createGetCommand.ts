import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import { getFirestoreData } from "~/actions/getFirestoreData";
import { CLIParser } from "~/utils";

export function createGetCommand(cli: Command, globalOptions: GlobalOptions) {
  cli
    .command("get <path>")
    .description("get a document from Firestore")
    .option(
      "--stringify [indent]",
      "JSON.stringify the output",
      CLIParser.integer()
    )
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = await getFirestoreData(config.connection, path, options);
      console.log(output);
    });
}

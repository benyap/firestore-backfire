import { Command } from "commander";
import {
  listFirestoreCollections,
  listFirestoreDocuments,
} from "~/actions/listFirestoreData";

import { resolveConfig, GlobalOptions } from "~/config";
import { CLIParser } from "~/utils";

export function createListCommand(cli: Command, globalOptions: GlobalOptions) {
  cli
    .command("list:documents <path>")
    .description("list document IDs from a collection")
    .option(
      "-l, --limit <limit>",
      "limit the number of document ids that are shown",
      CLIParser.integer()
    )
    .option("-c, --count", "count the number of documents")
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = await listFirestoreDocuments(
        config.connection,
        path,
        options
      );
      if (Array.isArray(output)) output.forEach((id) => console.log(id));
      else console.log(output);
    });

  cli
    .command("list:collections [path]")
    .description("list the collections at the specified path")
    .option(
      "-l, --limit <limit>",
      "limit the number of document ids that are shown",
      CLIParser.integer()
    )
    .option("-c, --count", "count the number of collections")
    .action(async (path: string | undefined, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = await listFirestoreCollections(
        config.connection,
        path,
        options
      );
      if (Array.isArray(output)) output.forEach((id) => console.log(id));
      else console.log(output);
    });
}

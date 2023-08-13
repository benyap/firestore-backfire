import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import {
  listFirestoreCollections,
  listFirestoreDocuments,
  countFirestoreCollections,
  countFirestoreDocuments,
} from "~/actions/listFirestoreData";

import {
  AdcOption,
  CountOption,
  EmulatorOption,
  KeyFileOption,
  LimitOption,
  ProjectOption,
} from "./options";

export function createListCommand(cli: Command, globalOptions: GlobalOptions) {
  const list = cli.command("list").description("list documents or collections");

  const count = cli
    .command("count")
    .description("count documents or collections");

  list
    .command("documents <path>")
    .description("list document IDs from a collection")
    // Connection options
    .addOption(ProjectOption({ action: "read" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    .addOption(AdcOption())
    // Action options
    .addOption(LimitOption({ countable: true }))
    .addOption(CountOption())
    // Action handler
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = await listFirestoreDocuments(
        config.connection,
        path,
        options,
      );
      output.forEach((id) => console.log(id));
    });

  list
    .command("collections [path]")
    .description("list collections at the specified path")
    // Connection options
    .addOption(ProjectOption({ action: "read" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    .addOption(AdcOption())
    // Action options
    .addOption(LimitOption({ countable: true }))
    .addOption(CountOption())
    // Action handler
    .action(async (path: string | undefined, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, action } = config;
      const output = await listFirestoreCollections(
        connection,
        path,
        action as any,
      );
      output.forEach((id) => console.log(id));
      process.exit(0);
    });

  count
    .command("documents <path>")
    .description("count documents from a collection")
    // Connection options
    .addOption(ProjectOption({ action: "read" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    .addOption(AdcOption())
    // Action handler
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const output = await countFirestoreDocuments(config.connection, path);
      console.log(output);
    });

  count
    .command("collections [path]")
    .description("count the collections at the specified path")
    // Connection options
    .addOption(ProjectOption({ action: "read" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    .addOption(AdcOption())
    // Action handler
    .action(async (path: string | undefined, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection } = config;
      const output = await countFirestoreCollections(connection, path);
      console.log(output);
      process.exit(0);
    });
}

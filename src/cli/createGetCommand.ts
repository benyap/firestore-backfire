import { Command } from "commander";

import { resolveConfig, GlobalOptions } from "~/config";
import { getFirestoreData } from "~/actions/getFirestoreData";

import {
  EmulatorOption,
  KeyFileOption,
  ProjectOption,
  StringifyOption,
} from "./options";

export function createGetCommand(cli: Command, globalOptions: GlobalOptions) {
  cli
    .command("get <path>")
    .description("get a document from Firestore")
    // Connection options
    .addOption(ProjectOption({ action: "read" }))
    .addOption(KeyFileOption())
    .addOption(EmulatorOption())
    // Action options
    .addOption(StringifyOption())
    // Action handler
    .action(async (path: string, options: any) => {
      const config = await resolveConfig(globalOptions, options);
      const { connection, action } = config;
      const output = await getFirestoreData(connection, path, action as any);
      console.log(output);
      process.exit(0);
    });
}

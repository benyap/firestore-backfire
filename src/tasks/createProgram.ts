import { Command, InvalidArgumentError } from "commander";

import { Constants } from "../config";
import { version } from "../version.json";

/**
 * Helper function for parsing an integer and ensuring that it is
 * within the specified minimum and maximum values. If not, an
 * `InvalidArgumentError` is thrown.
 *
 * @param rawValue The raw string value to parse.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns An integer between the minimum and maximum value.
 */
function validateMinMaxInteger(rawValue: string, min: number, max: number) {
  const value = parseInt(rawValue, 10);
  if (isNaN(value) || value < min || value > max)
    throw new InvalidArgumentError(`Must be an integer between ${min} and ${max}.`);
  return Math.min(min, value, max);
}

/**
 * Create the CLI parser program using commander.js.
 *
 * @returns The CLI parser program.
 */
export function createProgram() {
  const program = new Command();
  program
    .version(version)
    .name(Constants.MODULE_NAME)
    // Global options
    .option("--verbose", "output verbose logs");

  program
    .command("export <project>", { isDefault: true })
    .description("export data from Firestore")
    .requiredOption("-o, --out <path>", "path to output directory")
    .option("-k, --keyfile <path>", "path to account credentials JSON file")
    .option("--emulator <host>", "back up data from Firestore emulator")
    .option(
      "--collections [collections...]",
      "name of the root collections to back up (all collections backed up if not specified)"
    )
    .option(
      "--patterns [regex...]",
      "regex patterns that a document path must match to be backed up"
    )
    .option(
      "--concurrency <number>",
      "number of concurrent processes allowed",
      (value: string, _) =>
        validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY),
      Constants.MAX_CONCURRENCY
    )
    .option(
      "--depth <number>",
      "subcollection depth to back up",
      (value: string, _) => validateMinMaxInteger(value, 0, Constants.MAX_DEPTH),
      Constants.MAX_DEPTH
    )
    .option(
      "--json",
      "outputs data in JSON array format (only applies to local file streams)"
    )
    .action((projectId: string, options) => {
      console.log(projectId, program.opts(), options);
    })
    .command("import")
    .description("import data to Firestore")
    .requiredOption("-o, --out <path>", "path to output directory")
    .option("-k, --keyfile <path>", "path to account credentials JSON file")
    .option("--emulator <host>", "back up data from Firestore emulator")
    .option(
      "--collections [collections...]",
      "name of the root collections to back up (all collections backed up if not specified)"
    )
    .option(
      "--patterns [regex...]",
      "regex patterns that a document path must match to be backed up"
    )
    .option(
      "--concurrency <number>",
      "number of concurrent processes allowed",
      (value: string, _) =>
        validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY),
      Constants.MAX_CONCURRENCY
    )
    .option(
      "--depth <number>",
      "subcollection depth to back up",
      (value: string, _) => validateMinMaxInteger(value, 0, Constants.MAX_DEPTH),
      Constants.MAX_DEPTH
    )
    .option(
      "--json",
      "outputs data in JSON array format (only applies to local file streams)"
    )
    .action((projectId: string, options) => {
      console.log(projectId, program.opts(), options);
    });

  return program;
}

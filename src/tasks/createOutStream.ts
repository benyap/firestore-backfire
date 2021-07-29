import { writeFileSync, createWriteStream } from "fs";
import { resolve } from "path";

import { Config } from "../types";

/**
 * Create an output stream where data can be backed up to.
 *
 * @param path The path to write to.
 * @param config The program configuration.
 * @returns A stream that data can be written to.
 */
export function createOutStream(path: string, config: Config) {
  // TODO:
  if (config.out.startsWith("gs://"))
    throw new Error("Google Storage output paths (gs://*) are not yet supported.");

  return createFileWriteStream(path, config);
}

/**
 * Create a write stream to a file on the system.
 *
 * @param path The path to write to in the output directory.
 * @param config The program configuration.
 * @returns A write stream.
 */
function createFileWriteStream(path: string, config: Config) {
  const outPath = resolve(__dirname, "..", "..", config.out, path);
  writeFileSync(outPath, "");
  return createWriteStream(outPath, { flags: "a" });
}

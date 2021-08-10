import { LoggingService } from "../logger";
import { forkChild } from "../utils";

import type { ChildProcess, Serializable } from "child_process";
import type { ExportOptionsMessage, ImportOptionsMessage } from "../types";

/**
 * Helper function for creating child processes for an import / export task.
 *
 * @param processPath The path to the child process.
 * @param concurrency The number of child processes to create.
 * @param options Options to pass to the child process.
 * @param logger The logger to use to log messages from the child process.
 * @returns A list of child processes and metadata.
 */
function createChildProcesses<T extends Serializable & object>(
  processPath: string,
  concurrency: number,
  options: T,
  logger: LoggingService
) {
  const children: {
    identifier: string | number;
    process: ChildProcess;
    terminated: Promise<any>;
  }[] = [];

  for (let i = 0; i < concurrency; i++) {
    const identifier = i + 1;

    // Spawn process
    const { process, terminated } = forkChild<T>(identifier, processPath, logger, {
      identifier,
      ...options,
    });

    children.push({ identifier, process, terminated });
  }

  return children;
}

/**
 * Create the child processes for an export task.
 *
 * @param concurrency The number of child processes to create.
 * @param optionsForChild Options to pass on to the child process when it is spawned.
 * @param logger The logger to use to log messages from the child process.
 * @returns A list of child processes.
 */
export function createExportChildProcesses(
  concurrency: number,
  optionsForChild: Pick<ExportOptionsMessage, "protocol" | "path" | "options">,
  logger: LoggingService
) {
  return createChildProcesses<
    typeof optionsForChild & Pick<ExportOptionsMessage, "type">
  >(
    "actions/exportAction/subprocess",
    concurrency,
    {
      type: "config-export",
      ...optionsForChild,
    },
    logger
  );
}

/**
 * Create the child processes for an import task.
 *
 * @param concurrency The number of child processes to create.
 * @param optionsForChild Options to pass on to the child process when it is spawned.
 * @param logger The logger to use to log messages from the child process.
 * @returns A list of child processes.
 */
export function createImportChildProcesses(
  concurrency: number,
  optionsForChild: Pick<ImportOptionsMessage, "protocol" | "path" | "options">,
  logger: LoggingService
) {
  return createChildProcesses<
    typeof optionsForChild & Pick<ImportOptionsMessage, "type">
  >(
    "actions/importAction/subprocess",
    concurrency,
    {
      type: "config-import",
      ...optionsForChild,
    },
    logger
  );
}

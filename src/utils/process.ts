import { resolve } from "path";
import { fork, Serializable } from "child_process";

import type { LoggingService } from "../logger";
import type { LogLevel, LogMessage } from "../types";

/**
 * Fork a child process. Returns the child and a promise that resolves
 * when the child terminates.
 *
 * @param identifier An identifier for the child.
 * @param path The path to the child.
 * @param logger The logger to use for logging messages from the child.
 * @param startMessage The message to send to the child after it has been forked.
 */
export function forkChild<T extends Serializable = any>(
  identifier: string | number,
  path: string,
  logger: LoggingService,
  startMessage?: T
) {
  const modulePath = resolve(__dirname, "..", path);
  // Fork child
  const child = fork(modulePath);
  logger.debug(`Forked child process ${identifier} (${child.pid})`);

  // Create promise that resolves when when the child is terminated
  const terminated = new Promise((resolve, reject) => {
    // Start the child
    if (startMessage) child.send(startMessage);

    // Log messages from child
    child.on("message", (message: LogMessage) =>
      logger.logChildProcess(`${identifier} (${child.pid})`, message)
    );

    // Resolve / reject promise when child terminates
    child.on("exit", (code) => resolve(code));
    child.on("error", (error) => reject(error));
    child.on("close", (code) => reject(code));
  });

  return { process: child, terminated };
}

/**
 * Execute the provided function when the first message is received
 * from the parent. The function will be invoked with the message as
 * the argument. Once the function is finished, the process will be
 * terminated with exit code 0.
 *
 * @param run The function to execute.
 */
export function runOnMessage<T>(run: (arg: T) => any) {
  process.once("message", async (message: T) => {
    await run(message);
    process.exit(0);
  });
}

/**
 * Send a message to the parent process for logging.
 *
 * @param level The log level.
 * @param message The message to log.
 * @param data Additional data to log.
 */
export function log(level: LogLevel, message: string, data?: any) {
  const msg: LogMessage = { type: "log", level, message, data };
  process.send?.(msg);
}

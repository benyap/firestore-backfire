import { magenta, cyan, yellow, red, dim } from "ansi-colors";
import type { StyleFunction } from "ansi-colors";

import { LogLevel, LogMessage } from "./types";

export class LoggingService {
  static readonly DEFAULT_LEVELS: LogLevel[] = [
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
  ];

  private static COLOR_MAP: { [key in LogLevel]: StyleFunction } = {
    [LogLevel.DEBUG]: magenta,
    [LogLevel.INFO]: cyan,
    [LogLevel.WARN]: yellow,
    [LogLevel.ERROR]: red,
  };

  /**
   * Create a new local logger instance.
   *
   * @param source The logger's source, e.g. the component the logger is used in.
   * @param levels The levels to print to the console. Defaults to `LoggingService.DEFAULT_LEVELS`.
   */
  static create(source: string, levels?: LogLevel[]) {
    return new LoggingService(source, levels ?? LoggingService.DEFAULT_LEVELS);
  }

  private readonly outputMap: { [key in LogLevel]: (...data: any[]) => void };
  private readonly levels: Set<LogLevel>;

  private constructor(
    public readonly source: string,
    levels: LogLevel[],
    outputMap: Partial<{ [key in LogLevel]: (...data: any[]) => void }> = {}
  ) {
    this.outputMap = {
      [LogLevel.DEBUG]: outputMap[LogLevel.DEBUG] ?? console.log,
      [LogLevel.INFO]: outputMap[LogLevel.INFO] ?? console.log,
      [LogLevel.WARN]: outputMap[LogLevel.WARN] ?? console.warn,
      [LogLevel.ERROR]: outputMap[LogLevel.ERROR] ?? console.error,
    };
    this.levels = new Set(levels);
  }

  /**
   * Print a log message to the console if the logger's level is appropriate.
   * Also saves the log message and any new tags to the database if the logger
   * was initialized with a `saveLog` and `saveTag` method.
   */
  private async createLog(options: {
    level: LogLevel;
    message: string;
    data?: any;
    error?: Error;
    prefix?: string;
  }) {
    const { level, message, data, error, prefix } = options;

    // Only log message to console if we match the log level
    if (this.levels.has(level)) {
      // Construct preamble
      const preamble = [LoggingService.COLOR_MAP[level](level)];
      if (prefix) preamble.push(dim(prefix));

      // Print message
      this.outputMap[level](`${preamble.join(" ")} ${message}`);

      // Print data if provided
      if (data) this.outputMap[level](data);
    }

    // Always log the error if there was an error provided
    if (error) this.outputMap[LogLevel.ERROR](error);
  }

  debug(message: string, data?: any) {
    this.createLog({ level: LogLevel.DEBUG, message, data });
  }

  info(message: string, data?: any) {
    this.createLog({ level: LogLevel.INFO, message, data });
  }

  warn(message: string, data?: any) {
    this.createLog({ level: LogLevel.WARN, message, data });
  }

  error(message: string, error?: Error, data?: any) {
    this.createLog({ level: LogLevel.ERROR, message, error, data });
  }

  logChildProcess(pid: string, msg: LogMessage) {
    const { level, message, data } = msg;
    this.createLog({
      level: level,
      message,
      prefix: pid,
      ...(data ? { data } : null),
    });
  }
}

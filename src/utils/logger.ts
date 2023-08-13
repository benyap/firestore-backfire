import {
  StyleFunction,
  magenta,
  cyan,
  yellow,
  red,
  green,
  bold,
  dim,
} from "ansi-colors";

export enum LogLevel {
  VERBOSE = "verbose",
  DEBUG = "debug",
  INFO = "info",
  SUCCESS = "success",
  WARN = "warn",
  ERROR = "error",
}

const LogLevelLength = Math.max(
  ...Object.values(LogLevel).map((l) => l.length),
);

export class Logger {
  private static COLOR_MAP: { [key in LogLevel]: StyleFunction } = {
    [LogLevel.VERBOSE]: cyan,
    [LogLevel.DEBUG]: magenta,
    [LogLevel.INFO]: green,
    [LogLevel.SUCCESS]: green,
    [LogLevel.WARN]: yellow,
    [LogLevel.ERROR]: red,
  };

  /**
   * Create a new logger instance.
   *
   * @param context The logger's context.
   * @param level The log output level.
   */
  static create(
    context: string,
    level: "silent" | "info" | "debug" | "verbose" | LogLevel[] = "info",
  ) {
    let levels: LogLevel[] = Array.isArray(level) ? level : [];

    switch (level) {
      case "info":
        levels = [
          LogLevel.INFO,
          LogLevel.SUCCESS,
          LogLevel.WARN,
          LogLevel.ERROR,
        ];
        break;
      case "debug":
        levels = [
          LogLevel.DEBUG,
          LogLevel.INFO,
          LogLevel.SUCCESS,
          LogLevel.WARN,
          LogLevel.ERROR,
        ];
        break;
      case "verbose":
        levels = Object.values(LogLevel);
        break;
    }

    return new Logger(context, levels);
  }

  private readonly levels: Set<LogLevel>;
  private readonly outputMap: { [key in LogLevel]: typeof console.log };

  private constructor(
    public readonly context: string,
    levels: LogLevel[],
    outputMap: Partial<{ [key in LogLevel]: typeof console.log }> = {},
  ) {
    this.levels = new Set(levels);
    this.outputMap = {
      [LogLevel.VERBOSE]: outputMap[LogLevel.VERBOSE] ?? console.log,
      [LogLevel.DEBUG]: outputMap[LogLevel.DEBUG] ?? console.log,
      [LogLevel.INFO]: outputMap[LogLevel.INFO] ?? console.log,
      [LogLevel.SUCCESS]: outputMap[LogLevel.SUCCESS] ?? console.log,
      [LogLevel.WARN]: outputMap[LogLevel.WARN] ?? console.warn,
      [LogLevel.ERROR]: outputMap[LogLevel.ERROR] ?? console.error,
    };
  }

  /**
   * Print a formatted log message if the logger's level is appropriate.
   */
  private createLog(options: {
    level: LogLevel;
    message: any | any[];
    data?: any;
    context?: string;
  }) {
    const { level, message, data, context = this.context } = options;

    // Only log message to console if we match the log level
    if (this.levels.has(level)) {
      const prefix: string[] = [];

      if (context) prefix.push(bold(dim(context)));

      const time = new Date().toLocaleTimeString();
      prefix.push(dim(time));

      const paddedLevel = level.padEnd(LogLevelLength);
      prefix.push(Logger.COLOR_MAP[level](bold(paddedLevel)));

      // Print message
      const output = Array.isArray(message) ? message : [message];
      this.outputMap[level](...prefix, ...output);

      // Print data if provided
      if (data) this.outputMap[level](data);
    }
  }

  verbose(...message: any[]) {
    this.createLog({ level: LogLevel.VERBOSE, message });
  }

  debug(...message: any[]) {
    this.createLog({ level: LogLevel.DEBUG, message });
  }

  info(...message: any[]) {
    this.createLog({ level: LogLevel.INFO, message });
  }

  success(...message: any[]) {
    this.createLog({ level: LogLevel.SUCCESS, message });
  }

  warn(...message: any[]) {
    this.createLog({ level: LogLevel.WARN, message });
  }

  error(...message: any[]) {
    this.createLog({ level: LogLevel.ERROR, message });
  }
}

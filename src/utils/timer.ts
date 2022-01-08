import { padNumberStart } from "./pad";

type LogFunction = (message: any) => void;

export interface ILoggable {
  verbose?: LogFunction;
  debug: LogFunction;
  log: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

export class Timer {
  /**
   * Create a new timer factory. Uses the provided `ILoggable` or function to
   * log when the timer is started and stopped.
   *
   * @param logger The logger interface or function to use. If not provided, no logs will be created.
   */
  static create(logger?: LogFunction | ILoggable) {
    return new Timer(logger);
  }

  /**
   * Create a timer instance and start it. Uses the provided `ILoggable`
   * to log when the timer is started and stopped.
   *
   * @param message The message to print when the timer starts.
   * @param logger The logger interface to use. If not provided, no logs will be created.
   * @param level The log level to print messages with. Defaults to "debug".
   */
  static start(
    message?: string,
    logger?: ILoggable | LogFunction,
    level: keyof ILoggable = "debug"
  ): TimerInstance {
    return Timer.create(logger).start(message, level);
  }

  private constructor(private logger?: ILoggable | LogFunction) {}

  /**
   * Create a timer instance and start it.
   *
   * @param message The message to print when the timer starts.
   * @param level The log level to print messages with. Defaults to "debug".
   */
  start(message?: string, level: keyof ILoggable = "debug"): TimerInstance {
    return new TimerInstance(
      new Date().getTime(),
      message ?? null,
      this.logger,
      level
    );
  }
}

export class TimerInstance {
  private static id = 0;

  static nextId() {
    if (TimerInstance.id >= 1000) TimerInstance.id = 0;
    return TimerInstance.id++;
  }

  private id: string;
  private stopTime: number | null = null;

  /**
   * @param startTime The timestamp (milliseconds) at which the timer started.
   * @param message The message to print when the timer starts.
   * @param logger The logger interface to use. If not provided, no logs will be created.
   * @param level The log level to print messages with. Defaults to "debug".
   */
  constructor(
    private startTime: number,
    public readonly message: string | null,
    private logger?: ILoggable | LogFunction,
    private level: keyof ILoggable = "debug"
  ) {
    this.id = `T${padNumberStart(TimerInstance.nextId(), 3)}`;
    this.log(level, `${message} (starting timer)`);
  }

  /**
   * Log a message to the logger if available.
   * @param level The level to log at. Ignored if the logger is a plain function.
   * @param message The message to log.
   */
  private log(level: keyof ILoggable, message: string) {
    if (typeof this.logger === "function") this.logger(message);
    else this.logger?.[level]?.(`[${this.id}] ${message}`);
  }

  /**
   * The timestamp (milliseconds) at which the timer started.
   */
  get startedAt(): number {
    return this.startTime;
  }

  /**
   * The timestamp (milliseconds) at which the timer stopped.
   * Returns `null` if the timer has not been stopped yet.
   */
  get stoppedAt(): number | null {
    return this.stopTime;
  }

  /**
   * The duration of the timer in milliseconds.
   * Returns `null` if the timer has not been stopped yet.
   */
  get duration(): number | null {
    if (!this.stopTime) return null;
    return this.stopTime - this.startTime;
  }

  get durationString(): string | null {
    if (typeof this.duration !== "number") return null;

    const hValue = Math.trunc(this.duration / 1000 / 60 / 60);
    const mValue = Math.trunc((this.duration / 1000 / 60) % 60);
    const sValue = Math.trunc((this.duration / 1000) % 60);
    const msValue = Math.trunc(this.duration % 1000);

    if (hValue > 0) {
      return `${hValue}h ${padNumberStart(mValue, 2)}m`;
    } else if (mValue > 0) {
      return `${mValue}m ${padNumberStart(sValue, 2)}s`;
    } else if (sValue > 0) {
      return `${sValue}.${padNumberStart(msValue, 3)}s`;
    } else {
      return `${msValue}ms`;
    }
  }

  /**
   * Stop the timer and returns the duration. If a `ILoggable` was provided
   * when the timer was created, the duration will be logged.
   *
   * @param message An optional message to print. If not provided, the starting message is printed.
   * @returns The duration in milliseconds.
   */
  stop(message?: string): number {
    this.stopTime = new Date().getTime();
    this.log(this.level, `${message ?? this.message} (took ${this.durationString})`);
    return this.duration!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

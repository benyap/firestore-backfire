import { formatDuration } from "./format";

type LogFunction = (message: any) => void;

export class Timer {
  /**
   * Create a new timer factory. Uses the provided `ILoggable` or function to
   * log when the timer is started and stopped.
   *
   * @param logFunction The logger interface or function to use. If not provided, no logs will be created.
   */
  static create(logFunction?: LogFunction) {
    return new Timer(logFunction);
  }

  /**
   * Create a timer instance and start it. Uses the provided `ILoggable`
   * to log when the timer is started and stopped.
   *
   * @param logFunction The logger interface to use. If not provided, no logs will be created.
   * @param message The message to print when the timer starts.
   */
  static start(logFunction?: LogFunction, message?: string): TimerInstance {
    return Timer.create(logFunction).start(message);
  }

  private constructor(private logFunction?: LogFunction) {}

  /**
   * Create a timer instance and start it.
   *
   * @param message The message to print when the timer starts.
   */
  start(message?: string): TimerInstance {
    return new TimerInstance(new Date().getTime(), this.logFunction, message);
  }
}

export class TimerInstance {
  private stopTime: number | null = null;

  /**
   * @param startTime The timestamp (milliseconds) at which the timer started.
   * @param message The message to print when the timer starts. If not provided, no message is printed.
   * @param logger The logger interface to use. If not provided, no logs will be created.
   */
  constructor(
    private startTime: number,
    private logger?: LogFunction,
    public readonly message?: string,
  ) {
    if (message) this.logger?.(message);
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

    const duration = this.stopTime - this.startTime;
    const timestamp = formatDuration(duration);

    if (message || this.message)
      this.logger?.(`${message || this.message} (took ${timestamp})`);

    return duration;
  }
}

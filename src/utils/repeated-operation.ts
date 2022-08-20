import { EError } from "exceptional-errors";

export type RepeatedOperationOptions = {
  when: () => boolean;
  action: (
    controller: AbortController,
    attempt: number
  ) => void | Promise<void>;
  until: () => boolean;
  onStart: () => void;
  onDone: (attempt: number) => void;
  onAbort: (attempt: number) => void;
  onError: (error: unknown, attempt: number) => void | Promise<void>;
  onLimitExceeded: (attempt: number) => void;
  interval: number | null;
  intervalType: "static" | "linear" | "exponential";
  resetInterval: boolean;
  limit: number | null;
};

const yes = () => true;
const no = () => false;
const empty = () => {};

function wait(ms: number, controller?: AbortController) {
  return new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, ms);
    // If the waiting is aborted, clearn the timeout and resolve immediately
    if (controller)
      controller.signal.onabort = () => {
        clearTimeout(timeout);
        resolve();
      };
  });
}

export class OperationError extends EError {}
export class FailedToStartOperationError extends OperationError {}
export class FailedToAbortOperationError extends OperationError {}
export class LimitExceededError extends OperationError {}
export class InvalidIntervalError extends OperationError {}

export class RepeatedOperation {
  private options: RepeatedOperationOptions;
  private operationController?: AbortController;
  private waitController?: AbortController;

  private attempts: number = 0;
  private interval: number = 0;

  constructor({
    when,
    action,
    until,
    onStart,
    onDone,
    onAbort,
    onError,
    onLimitExceeded,
    interval,
    intervalType,
    resetInterval,
    limit,
  }: Partial<RepeatedOperationOptions>) {
    this.options = {
      when: when ?? yes,
      action: action ?? empty,
      until: until ?? no,
      onStart: onStart ?? empty,
      onDone: onDone ?? empty,
      onAbort: onAbort ?? empty,
      onError: onError ?? empty,
      onLimitExceeded: onLimitExceeded ?? empty,
      interval: interval ?? null,
      intervalType: intervalType ?? "static",
      resetInterval: resetInterval ?? false,
      limit: limit ?? null,
    };
  }

  /**
   * Start the operation. The returned promise will resolve when
   * the operation is complete, or reject if the operation fails.
   *
   * NOTE: An aborted operation is considered complete, since the
   * aborting is caused by an external source.
   */
  start(controller: AbortController = new AbortController()) {
    if (this.operationController)
      throw new FailedToStartOperationError("already started");

    return new Promise<void>(async (resolve, reject) => {
      const {
        when,
        action,
        until,
        onStart,
        onDone,
        onAbort,
        onError,
        onLimitExceeded,
        interval,
        intervalType,
        resetInterval,
        limit,
      } = this.options;

      this.operationController = controller;
      this.interval = 0;

      if (!this.operationController)
        return reject(
          new FailedToStartOperationError("controller unavailable")
        );

      if (this.interval < 0)
        return reject(new InvalidIntervalError("must be positive"));

      onStart();

      while (true) {
        let start = Date.now();

        // Create a new abort controller for this wait cycle
        this.waitController = new AbortController();

        const aborted = new Promise<void>((resolve) => {
          if (!this.operationController) return resolve();
          this.operationController.signal.onabort = () => {
            // When the operation controller is aborted, also abort any waiting
            this.waitController?.abort();
            onAbort(this.attempts);
            resolve();
          };
        });

        // Reject if we exceed the number of attempts for this operation
        if (typeof limit === "number" && this.attempts >= limit) {
          onLimitExceeded(this.attempts);
          return reject(new LimitExceededError(`${this.attempts} attempt(s)`));
        }

        this.attempts++;

        // If the `when` condition is satisfied, execute the action
        if (when()) {
          try {
            await Promise.race([
              action(this.operationController, this.attempts),
              aborted,
            ]);

            if (resetInterval) this.interval = 0;
          } catch (error) {
            onError(error, this.attempts);
            return reject(error);
          }
        }

        // Resolve if the `until` condition is satisfied
        if (until()) {
          onDone(this.attempts);
          return resolve();
        }

        switch (intervalType) {
          case "static":
            this.interval = interval ?? 0;
            break;
          case "linear":
            this.interval += interval ?? 0;
            break;
          case "exponential":
            if (this.interval === 0) this.interval = interval ?? 0;
            else this.interval *= 2;
            break;
        }

        // Wait for next operation attempt
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, (this.interval ?? 0) - elapsed);
        await Promise.race([wait(remaining, this.waitController), aborted]);

        // End now if the opeartion was aborted
        if (this.operationController.signal.aborted) {
          return resolve();
        }
      }
    });
  }

  /**
   * Abort the operation. The promise returned from {@link start()} will resolve.
   */
  abort() {
    if (!this.operationController)
      throw new FailedToAbortOperationError("cannot abort");
    this.operationController.abort();
  }
}

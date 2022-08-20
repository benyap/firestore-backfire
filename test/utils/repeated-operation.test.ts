import { describe, test, expect, vi, beforeEach, Mock } from "vitest";

import {
  LimitExceededError,
  RepeatedOperation,
} from "~/utils/repeated-operation";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDiffs(times: number[]) {
  return times
    .map((time, index) => {
      if (index === 0) return 0;
      return time - times[index - 1]!;
    })
    .slice(1);
}

function sum(x: number[]) {
  return x.reduce((a, b) => a + b, 0);
}

function zip<A, B>(a: A[], b: B[]): [A | undefined, B | undefined][] {
  const longer = a.length > b.length ? a : b;
  return longer.map((_, i) => [a[i], b[i]]);
}

describe(RepeatedOperation.name, () => {
  let count = 0;
  let when: Mock;
  let action: Mock;
  let until: Mock;

  beforeEach(() => {
    count = 0;
    when = vi.fn();
    action = vi.fn();
    until = vi.fn();
  });

  describe("start()", () => {
    test("calling start() starts the operation", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
      });
      await expect(op.start()).resolves.toBeUndefined();
      expect(action).toHaveBeenCalledTimes(3);
      expect(until).toHaveBeenCalledTimes(3);
    });
  });

  describe("abort()", () => {
    test("calling abort() aborts the operation", async () => {
      const op = new RepeatedOperation({
        when: when.mockReturnValue(true),
        action: action.mockImplementation(() => op.abort()),
        until,
      });
      await expect(op.start()).resolves.toBeUndefined();
      expect(when).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledTimes(1);
      expect(until).toHaveBeenCalledTimes(1);
    });
  });

  describe("options.when", () => {
    test("does not run action when `options.when` returns `false`", async () => {
      const op = new RepeatedOperation({
        when: when.mockImplementation(() => {
          count++;
          return false;
        }),
        action,
        until: until.mockImplementation(() => count === 3),
      });
      await op.start();
      expect(when).toHaveBeenCalledTimes(3);
      expect(action).not.toHaveBeenCalled();
      expect(until).toHaveBeenCalledTimes(3);
    });

    test("runs action when `options.when` returns `true`", async () => {
      const op = new RepeatedOperation({
        when: when.mockReturnValue(true),
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
      });
      await op.start();
      expect(when).toHaveBeenCalledTimes(3);
      expect(action).toHaveBeenCalledTimes(3);
      expect(until).toHaveBeenCalledTimes(3);
    });
  });

  describe("options.action", () => {
    test("runs sychronous action", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
      });
      await op.start();
      expect(action).toHaveBeenCalledTimes(3);
      expect(until).toHaveBeenCalledTimes(3);
    });

    test("runs asynchronous action", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(async () => count++),
        until: until.mockImplementation(() => count === 3),
      });
      await op.start();
      expect(action).toHaveBeenCalledTimes(3);
      expect(until).toHaveBeenCalledTimes(3);
    });
  });

  describe("options.onStart", () => {
    let onStart: Mock;

    beforeEach(() => {
      onStart = vi.fn();
    });

    test("calls onStart when the operation is started", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
        onStart,
      });
      await op.start();
      expect(onStart).toHaveBeenCalledOnce();
    });
  });

  describe("options.onDone", () => {
    let onDone: Mock;

    beforeEach(() => {
      onDone = vi.fn();
    });

    test("calls onDone when the operation is finished", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
        onDone,
      });
      await op.start();
      expect(onDone).toHaveBeenCalledOnce();
    });

    test("does not call onDone when the operation fails", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
        limit: 2,
        onDone,
      });
      await expect(op.start()).rejects.toThrowError(LimitExceededError);
      expect(onDone).not.toHaveBeenCalled();
    });
  });

  describe("options.onAbort", () => {
    let onAbort: Mock;

    beforeEach(() => {
      onAbort = vi.fn();
    });

    test("calls onAbort when the operation is aborted", async () => {
      const op = new RepeatedOperation({ onAbort });
      op.start();
      op.abort();
      expect(onAbort).toHaveBeenCalledWith(1);
    });

    test("does not call onAbort when the operation finishes successfully", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
        onAbort,
      });
      await op.start();
      expect(onAbort).not.toHaveBeenCalled();
    });
  });

  describe("options.onError", () => {
    class CustomError extends Error {}

    let onError: Mock;

    beforeEach(() => {
      onError = vi.fn();
    });

    test("calls onError when synchronous action throws an error", async () => {
      const error = new CustomError();
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => {
          throw error;
        }),
        onError,
      });
      await expect(op.start()).rejects.toThrowError(CustomError);
      expect(action).toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(error, 1);
    });

    test("calls onError when asynchronous action throws an error", async () => {
      const error = new CustomError();
      const op = new RepeatedOperation({
        action: action.mockImplementation(async () => {
          throw error;
        }),
        onError,
      });
      await expect(op.start()).rejects.toThrowError(CustomError);
      expect(action).toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(error, 1);
    });

    test("does not call onError when the operation finishes successfully", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 3),
        onError,
      });
      await op.start();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("options.onLimitExceeded", () => {
    let onLimitExceeded: Mock;

    beforeEach(() => {
      onLimitExceeded = vi.fn();
    });

    test("calls onLimitExceeded when the limit is exceeded", async () => {
      const op = new RepeatedOperation({
        action,
        limit: 3,
        onLimitExceeded,
      });
      await expect(op.start()).rejects.toThrowError(LimitExceededError);
      expect(action).toHaveBeenCalledTimes(3);
      expect(onLimitExceeded).toHaveBeenCalledWith(3);
    });

    test("does not call onLimitExceeded when the operation finishes successfully", async () => {
      const op = new RepeatedOperation({
        action: action.mockImplementation(() => count++),
        until: until.mockImplementation(() => count === 2),
        limit: 3,
        onLimitExceeded,
      });
      await op.start();
      expect(action).toHaveBeenCalledTimes(2);
      expect(until).toHaveBeenCalledTimes(2);
      expect(onLimitExceeded).not.toHaveBeenCalled();
    });
  });

  describe("options.interval", () => {
    test("waits using the specified interval between each operation call", async () => {
      const interval = 100;
      const op = new RepeatedOperation({
        when: when.mockReturnValue(true),
        action,
        interval,
      });
      op.start();
      await new Promise((resolve) => setTimeout(resolve, interval * 3));
      op.abort();
      expect(action).toHaveBeenCalledTimes(3);
    });
  });

  describe("options.intervalType", () => {
    const INTERVAL = 50;
    const TOLERANCE = 10;

    let times: number[] = [];

    beforeEach(() => {
      times = [];
      when.mockImplementation(() => {
        times.push(Date.now());
        return true;
      });
    });

    test("static interval waits the same amount of time between each call", async () => {
      const expected = [INTERVAL, INTERVAL, INTERVAL];

      const op = new RepeatedOperation({
        when,
        interval: INTERVAL,
        intervalType: "static",
      });

      op.start();
      await wait(sum(expected) + TOLERANCE);
      op.abort();

      const diffs = getDiffs(times);
      for (const [diff, ex] of zip(diffs, expected)) {
        expect(diff).toBeLessThan(ex! + TOLERANCE);
        expect(diff).toBeGreaterThan(ex! - TOLERANCE);
      }
    });

    test("linear interval waits a linearly increasing amount of time between each call", async () => {
      const expected = [1 * INTERVAL, 2 * INTERVAL, 3 * INTERVAL];

      const op = new RepeatedOperation({
        when,
        interval: INTERVAL,
        intervalType: "linear",
      });

      op.start();
      await wait(sum(expected) + TOLERANCE);
      op.abort();

      const diffs = getDiffs(times);

      for (const [diff, ex] of zip(diffs, expected)) {
        expect(diff).toBeLessThan(ex! + TOLERANCE);
        expect(diff).toBeGreaterThan(ex! - TOLERANCE);
      }
    });

    test("linear exponential waits a exponentially increasing amount of time between each call", async () => {
      const expected = [1 * INTERVAL, 2 * INTERVAL, 4 * INTERVAL];

      const op = new RepeatedOperation({
        when,
        interval: INTERVAL,
        intervalType: "exponential",
      });

      op.start();
      await wait(sum(expected) + TOLERANCE);
      op.abort();

      const diffs = getDiffs(times);

      for (const [diff, ex] of zip(diffs, expected)) {
        expect(diff).toBeLessThan(ex! + TOLERANCE);
        expect(diff).toBeGreaterThan(ex! - TOLERANCE);
      }
    });
  });

  describe("options.resetInterval", () => {
    const INTERVAL = 50;
    const TOLERANCE = 5;

    let iteration: number;
    let times: number[] = [];

    beforeEach(() => {
      iteration = 1;
      times = [];
      when.mockImplementation(() => {
        times.push(Date.now());
        // always return true on 3rd iteration
        return iteration++ === 3;
      });
    });

    test("interval resets when the action is executed when `resetInterval` is true", async () => {
      const expected = [
        1 * INTERVAL,
        2 * INTERVAL,
        1 * INTERVAL,
        2 * INTERVAL,
        3 * INTERVAL,
      ];

      const op = new RepeatedOperation({
        when,
        interval: INTERVAL,
        intervalType: "linear",
        resetInterval: true,
      });

      op.start();
      await wait(sum(expected) + TOLERANCE);
      op.abort();

      const diffs = getDiffs(times);

      for (const [diff, ex] of zip(diffs, expected)) {
        expect(diff).toBeLessThan(ex! + TOLERANCE);
        expect(diff).toBeGreaterThan(ex! - TOLERANCE);
      }
    });

    test("interval does not reset when the action is executed when `resetInterval` is false", async () => {
      const expected = [1 * INTERVAL, 2 * INTERVAL, 3 * INTERVAL, 4 * INTERVAL];

      const op = new RepeatedOperation({
        when,
        interval: INTERVAL,
        intervalType: "linear",
        resetInterval: false,
      });

      op.start();
      await wait(sum(expected) + TOLERANCE);
      op.abort();

      const diffs = getDiffs(times);

      for (const [diff, ex] of zip(diffs, expected)) {
        expect(diff).toBeLessThan(ex! + TOLERANCE);
        expect(diff).toBeGreaterThan(ex! - TOLERANCE);
      }
    });
  });

  describe("options.limit", () => {
    test("operation rejects when limit is exceeded", async () => {
      const op = new RepeatedOperation({
        when: when.mockReturnValue(true),
        action,
        limit: 3,
      });
      await expect(op.start()).rejects.toThrow(LimitExceededError);
      expect(when).toHaveBeenCalledTimes(3);
      expect(action).toHaveBeenCalledTimes(3);
    });

    test("attempts are counted even if action is not executed", async () => {
      const op = new RepeatedOperation({
        when: when.mockReturnValue(false),
        action,
        limit: 3,
      });
      await expect(op.start()).rejects.toThrow(LimitExceededError);
      expect(when).toHaveBeenCalledTimes(3);
      expect(action).toHaveBeenCalledTimes(0);
    });
  });
});

import { beforeEach, describe, expect, test } from "vitest";

import { Lock } from "~/utils/lock";

describe(Lock.name, () => {
  let lock: Lock;

  beforeEach(() => {
    lock = new Lock();
  });

  test("not locked by default", () => {
    expect(lock.locked).toBe(false);
  });

  test("locked when acquire() is called once", () => {
    lock.acquire();
    expect(lock.locked).toBe(true);
  });

  test("locked when acquire() is called multiple times", () => {
    lock.acquire();
    lock.acquire();
    lock.acquire();
    expect(lock.locked).toBe(true);
  });

  test("unlocked when release() is called after acquire() is called", () => {
    lock.acquire();
    lock.release();
    expect(lock.locked).toBe(false);
  });

  test("unlocked when release() is called more times than acquire()", () => {
    lock.acquire();
    lock.release();
    lock.release();
    expect(lock.locked).toBe(false);
  });

  test("lockable even when when release() is called more times than acquire()", () => {
    lock.acquire();
    lock.release();
    lock.release();
    lock.release();
    lock.acquire();
    expect(lock.locked).toBe(true);
  });

  test("does not unlock when acquire() is called more than release()", () => {
    lock.acquire();
    lock.acquire();
    lock.release();
    expect(lock.locked).toBe(true);
  });
});

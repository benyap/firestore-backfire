import { describe, test, expect, beforeEach } from "vitest";

import { TrackableList, TrackableNumber, Tracker } from "~/utils/track";

describe(Tracker.name, () => {
  let tracker: Tracker;

  beforeEach(() => {
    tracker = new Tracker();
  });

  test("not touched by default", () => {
    expect(tracker.touched()).toBe(false);
  });

  test("touched() returns `true` after a touch() call", () => {
    tracker.touch();
    expect(tracker.touched()).toBe(true);
  });

  test("touched() returns `false` once touch() has been called", async () => {
    tracker.touch();
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
    expect(tracker.touched()).toBe(false);
  });

  test("multiple touch() calls are registered", async () => {
    tracker.touch();
    tracker.touch();
    tracker.touch();
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
    expect(tracker.touched()).toBe(false);
  });

  test("touch() still works after being reset by a touched() call", async () => {
    tracker.touch();
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
    tracker.touch();
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });
});

describe(TrackableNumber.name, () => {
  let tracker: Tracker;
  let number: TrackableNumber;

  beforeEach(() => {
    tracker = new Tracker();
    number = new TrackableNumber(tracker);
  });

  test("default value is 0", () => {
    expect(number.val).toBe(0);
  });

  test("set() sets value", () => {
    number.set(12);
    expect(number.val).toBe(12);
  });

  test("increment() increases the value", () => {
    number.increment(1);
    expect(number.val).toBe(1);
    number.increment(10);
    expect(number.val).toBe(11);
  });

  test("decrement() decreases the value", () => {
    number.decrement(1);
    expect(number.val).toBe(-1);
    number.decrement(10);
    expect(number.val).toBe(-11);
  });

  test("set() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    number.set(1);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });

  test("increment() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    number.increment(1);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });

  test("decrement() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    number.decrement(1);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });
});

describe(TrackableList.name, () => {
  let tracker: Tracker;
  let list: TrackableList<number>;

  beforeEach(() => {
    tracker = new Tracker();
    list = new TrackableList(tracker);
  });

  test("default value is []", () => {
    expect(list.val).toEqual([]);
  });

  test("set() sets the values in the list", () => {
    list.set([1, 2, 3, 4]);
    expect(list.val).toEqual([1, 2, 3, 4]);
  });

  test("set() makes a copy of the list", () => {
    const myList = [1, 2, 3, 4];
    list.set(myList);
    expect(list.val).toEqual([1, 2, 3, 4]);
    myList.push(5);
    expect(list.val).toEqual([1, 2, 3, 4]);
  });

  test("push() adds to the list", () => {
    list.push(1);
    expect(list.val).toEqual([1]);
    list.push(2);
    expect(list.val).toEqual([1, 2]);
  });

  test("pop() removes from the list", () => {
    list.set([1]);
    expect(list.pop()).toBe(1);
    expect(list.val).toEqual([]);
    expect(list.pop()).toBeUndefined();
    expect(list.val).toEqual([]);
  });

  test("dequeue() removes the specified number of items from the list", () => {
    list.set([1, 2, 3, 4]);
    expect(list.dequeue()).toEqual([1]);
    expect(list.val).toEqual([2, 3, 4]);
    expect(list.dequeue(3)).toEqual([2, 3, 4]);
    expect(list.val).toEqual([]);
    expect(list.dequeue(2)).toEqual([]);
    expect(list.val).toEqual([]);
  });

  test("set() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    list.set([1, 2]);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });

  test("push() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    list.push(1);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });

  test("pop() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    list.pop();
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });

  test("dequeue() touches the tracker", () => {
    expect(tracker.touched()).toBe(false);
    list.dequeue(1);
    expect(tracker.touched()).toBe(true);
    expect(tracker.touched()).toBe(false);
  });
});

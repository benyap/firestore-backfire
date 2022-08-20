export class Tracker {
  private _touched = false;

  /**
   * Track a touch.
   */
  touch() {
    this._touched = true;
  }

  /**
   * Returns `true` if the tracker was updated
   * since last time this method was called.
   */
  touched() {
    const wasTouched = this._touched;
    this._touched = false;
    return wasTouched;
  }
}

export abstract class Trackable<T> {
  protected abstract value: T;

  constructor(protected tracker: Tracker) {}

  /**
   * The value stored in the tracker.
   */
  get val() {
    return this.value;
  }

  /**
   * Set the value stored in the tracker.
   * Also updates the tracker.
   */
  set(value: T) {
    this.value = value;
    this.tracker.touch();
  }
}

export class TrackableNumber extends Trackable<number> {
  protected value = 0;

  increment(amount: number) {
    this.value += amount;
    this.tracker.touch();
  }

  decrement(amount: number) {
    this.value -= amount;
    this.tracker.touch();
  }
}

export class TrackableList<T> extends Trackable<T[]> {
  protected value: T[] = [];

  get length() {
    return this.value.length;
  }

  override set(value: T[]) {
    // Make a copy of the list otherwise mutable methods
    // (push/pop/splice) could affect the original list
    this.value = [...value];
    this.tracker.touch();
  }

  push(...values: [T, ...T[]]) {
    this.value.push(...values);
    this.tracker.touch();
  }

  pop(): T | undefined {
    this.tracker.touch();
    return this.value.pop();
  }

  dequeue(amount: number = 1): T[] {
    this.tracker.touch();
    return this.value.splice(0, amount);
  }
}

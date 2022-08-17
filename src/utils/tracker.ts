export class Tracker {
  private lastTouched: Date | null = null;
  private lastChecked = new Date();

  touch() {
    this.lastTouched = new Date();
  }

  touched() {
    const lastChecked = this.lastChecked;
    this.lastChecked = new Date();
    return !this.lastTouched || this.lastTouched > lastChecked;
  }
}

export abstract class Trackable<T> {
  protected abstract value: T;

  constructor(protected tracker: Tracker) {}

  get val() {
    return this.value;
  }

  set(value: T) {
    this.value = value;
    this.tracker.touch();
  }
}

export class TrackableNumber extends Trackable<number> {
  protected value = 0;

  add(amount: number) {
    this.value += amount;
    this.tracker.touch();
  }

  subtract(amount: number) {
    this.value -= amount;
    this.tracker.touch();
  }
}

export class TrackableList<T> extends Trackable<T[]> {
  protected value: T[] = [];

  get length() {
    return this.value.length;
  }

  push(...values: [T, ...T[]]) {
    this.value.push(...values);
    this.tracker.touch();
  }

  update<V>(callback: (value: T[]) => V) {
    const result = callback(this.value);
    this.tracker.touch();
    return result;
  }
}

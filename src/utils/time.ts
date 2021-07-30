export class TimerResult {
  constructor(public readonly start: number, public readonly end: number) {}

  get duration() {
    return this.end - this.start;
  }

  get timeString() {
    const d = this.duration / 1000 / 60 / 60 / 24;
    const h = (this.duration / 1000 / 60 / 60) % 24;
    const m = (this.duration / 1000 / 60) % 60;
    const s = (this.duration / 1000) % 60;
    const ms = this.duration % 1000;

    const parts: string[] = [];

    if (d > 1) parts.push(`${Math.floor(d)}d`);
    if (h > 1 || parts.length > 0) parts.push(`${Math.floor(h)}h`);
    if (m > 1 || parts.length > 0) parts.push(`${Math.floor(m)}m`);
    if (s > 1 || parts.length > 0) {
      if (d > 1 || h > 1 || m > 1) parts.push(`${Math.floor(s)}s`);
      else parts.push(`${s.toFixed(3)}s`);
    } else {
      parts.push(`${Math.floor(ms)}ms`);
    }

    return parts.join(" ");
  }
}

/**
 * Time how long a callback function takes to execute.
 *
 * @param callback The callback function to time.
 * @returns The result of the callbac, and a `TimerResult` which stores the duration it took to execute the callback.
 */
export async function time<T = any>(callback: () => Promise<T>) {
  const start = Date.now();
  const result = await callback();
  const end = Date.now();
  return {
    result,
    duration: new TimerResult(start, end),
  };
}

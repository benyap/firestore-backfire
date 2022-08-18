import { yellow, green, bold, cyan } from "ansi-colors";

import { TrackableList, TrackableNumber } from "./tracker";

export function dir(path: string | undefined) {
  return green(path ?? "");
}

export function ref(path: string | undefined) {
  return cyan(path ?? "");
}

export function b(value: string | undefined) {
  return bold(value ?? "");
}

export function count(
  n: number | string | unknown[] | TrackableNumber | TrackableList<unknown>
) {
  let count: number | null = null;
  if (typeof n === "number") count = n;
  else if (n instanceof TrackableNumber) count = n.val;
  else if (n instanceof TrackableList || Array.isArray(n)) count = n.length;
  else return yellow(n);
  return yellow(count.toString());
}

export function plural(
  num: number | unknown[],
  word: string,
  plural = `${word}s`
) {
  num = Array.isArray(num) ? num.length : num;
  return `${count(num)} ${num === 1 ? word : plural}`;
}

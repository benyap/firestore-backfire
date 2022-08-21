import { yellow, green, bold, cyan, red } from "ansi-colors";

import { TrackableList, TrackableNumber } from "./track";

export const y = green("✔");
export const n = red("✘");

export function dir(path: string | undefined) {
  return green(path ?? "");
}

export function ref(path: string | undefined) {
  return cyan(path ?? "");
}

export function b(value: string | undefined) {
  return bold(value ?? "");
}

export function capitalize(message: string) {
  const start = message.at(0)?.toUpperCase() ?? "";
  return start + message.slice(1);
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

export function formatDuration(duration: number) {
  const hValue = Math.trunc(duration / 1000 / 60 / 60);
  const mValue = Math.trunc((duration / 1000 / 60) % 60);
  const sValue = Math.trunc((duration / 1000) % 60);
  const msValue = Math.trunc(duration % 1000);

  if (hValue > 0) {
    return `${hValue}h ${mValue.toString().padStart(2)}m`;
  } else if (mValue > 0) {
    return `${mValue}m ${sValue.toString().padStart(2)}s`;
  } else if (sValue > 0) {
    if (msValue > 0) return `${sValue}.${msValue.toString().padStart(3, "0")}s`;
    else return `${sValue}s`;
  } else {
    return `${msValue}ms`;
  }
}

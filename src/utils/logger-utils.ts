import { yellow, green } from "ansi-colors";
import { TrackableList, TrackableNumber } from "./tracker";

export function dir(path: string) {
  return green(path);
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

import { count as countPrint } from "./logger-utils";

export function plural(
  count: number | unknown[],
  word: string,
  plural = `${word}s`
) {
  count = Array.isArray(count) ? count.length : count;
  return `${countPrint(count)} ${count === 1 ? word : plural}`;
}

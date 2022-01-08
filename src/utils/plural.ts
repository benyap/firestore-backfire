import { StyleFunction } from "ansi-colors";

/**
 * Return the singular / plural form of the word given word based on the count.
 *
 * @param count If this is `1`, the singular form of the word is returned.
 * @param word The singular form of the word.
 * @param pluralWord The plural form of the word. Defaults to `word` with "s".
 */
export function plural(
  count: number,
  word: string,
  pluralWord: string = `${word}s`
) {
  if (count === 1) return word;
  return pluralWord;
}

/**
 * Returns a string with the count and the correct singular / plural form
 * of the word based on the count.
 *
 * @param count If this is `1`, the singular form of the word is returned.
 * @param word The singular form of the word.
 * @param pluralWord The plural form of the word. Defaults to `word` with "s".
 */
export function count(count: number, word: string, pluralWord?: string) {
  return `${count} ${plural(count, word, pluralWord)}`;
}

/**
 * Returns a string with the count styled with the given function and the
 * correct singular / plural form of the word based on the count.
 *
 * @param style The function that will be used to style the count.
 * @param count If this is `1`, the singular form of the word is returned.
 * @param word The singular form of the word.
 * @param pluralWord The plural form of the word. Defaults to `word` with "s".
 */
export function styledCount(
  style: StyleFunction,
  count: number,
  word: string,
  pluralWord?: string
) {
  return `${style(String(count))} ${plural(count, word, pluralWord)}`;
}

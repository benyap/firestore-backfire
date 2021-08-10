import parseRegex from "regex-parser";

import { ErrorWithDetails } from "../errors";

/**
 * Escape the provided value to return a Regex safe string
 * that can be used to match the provided value.
 *
 * @param string The string to escape.
 */
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Convert a string to a regular expression object.
 *
 * @param string The string to convert to a `RegExp`.
 */
export function stringToRegex(string: string) {
  try {
    return parseRegex(string);
  } catch (error) {
    throw new ErrorWithDetails(error.message);
  }
}

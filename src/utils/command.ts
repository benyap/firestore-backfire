import { InvalidArgumentError } from "commander";

/**
 * Helper function for parsing an integer and ensuring that it is
 * within the specified minimum and maximum values. If not, an
 * `InvalidArgumentError` is thrown.
 *
 * @param rawValue The raw string value to parse.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns An integer between the minimum and maximum value.
 */
export function validateMinMaxInteger(rawValue: string, min: number, max: number) {
  const value = parseInt(rawValue, 10);
  if (isNaN(value) || value < min || value > max)
    throw new InvalidArgumentError(`Must be an integer between ${min} and ${max}.`);
  return Math.max(min, Math.min(value, max));
}

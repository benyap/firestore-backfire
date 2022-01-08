import { InvalidArgumentError } from "commander";

export function isInteger(rawValue: string, name: string) {
  const value = parseInt(rawValue);
  if (isNaN(value)) throw new InvalidArgumentError(`${name} must be an integer.`);
  return value;
}

export function isBetween(value: number, min: number, max: number, name: string) {
  if (value < min || value > max)
    throw new InvalidArgumentError(`${name} must be between ${min} and ${max}.`);
  return value;
}

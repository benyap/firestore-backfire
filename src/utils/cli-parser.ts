import { InvalidArgumentError } from "commander";

export class CliParser {
  static integer(
    options: { min?: number; max?: number } = {}
  ): (value: string) => number {
    const { min, max } = options;
    return (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed))
        throw new InvalidArgumentError(`"${value}" is not an integer.`);
      if (typeof min === "number" && parsed < min)
        throw new InvalidArgumentError(`Must be greater or equal to ${min}.`);
      if (typeof max === "number" && parsed > max)
        throw new InvalidArgumentError(`Must be less than or equal to ${max}.`);
      return parsed;
    };
  }
}

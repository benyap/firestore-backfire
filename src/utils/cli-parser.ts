import { InvalidArgumentError } from "commander";

export class CLIParser {
  static integer(): (value: string) => number {
    return (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed))
        throw new InvalidArgumentError(`"${value}" is not an integer.`);
      return parsed;
    };
  }
}

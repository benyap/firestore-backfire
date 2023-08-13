/**
 * NDJSON: New-line Delimited JSON
 */
export class NDJSON {
  /**
   * Stringify a list of objects into NDJSON format.
   */
  static stringify(data: any[]): string {
    return data.map((record) => JSON.stringify(record)).join("\n");
  }

  /**
   * Parse an NDJSON string back into a list of objects.
   * Empty new-lines are skipped.
   *
   * @param options.safe If `true`, lines with parsing errors are ignored.
   */
  static parse<T = unknown>(
    text: string,
    options: { safe?: boolean } = {},
  ): T[] {
    const fail = Symbol("fail");
    return text
      .split("\n")
      .map((text) => text.trim())
      .filter((text) => text.length > 0)
      .map((text) => {
        try {
          return JSON.parse(text) as T;
        } catch (error) {
          if (options.safe) return fail;
          throw error;
        }
      })
      .filter((val): val is T => val !== fail);
  }
}

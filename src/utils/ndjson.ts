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
   */
  static parse<T = unknown>(text: string): T[] {
    return text
      .split("\n")
      .map((text) => text.trim())
      .filter((text) => text.length > 0)
      .map((text) => JSON.parse(text));
  }
}

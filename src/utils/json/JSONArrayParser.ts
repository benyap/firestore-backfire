import { JSONTokenPairLexer } from "./JSONTokenPairLexer";

export class JSONArrayParser {
  private pairs: JSONTokenPairLexer = new JSONTokenPairLexer();

  private closed = false;
  private escape = false;
  private inString = false;

  private buffer: string = "";
  private parsable: string[] = [];

  /**
   * Process a portion of a stringified JSON array and pushes
   * any parseable chunks of JSON into a buffer. To read the
   * parseable items, use `flush()`.
   */
  process(data: string): void {
    if (this.closed) throw new Error("array is closed");

    for (const char of data) {
      if (this.escape) {
        this.escape = false;
        this.buffer += char;
        continue;
      }

      if (this.inString && char !== '"' && char !== "\\") {
        this.buffer += char;
        continue;
      }

      switch (char) {
        case "\\":
          this.escape = true;
          this.buffer += char;
          break;

        case "[":
          if (this.pairs.has(char)) {
            this.pairs.open(char);
            this.buffer += char;
          } else {
            // This indicates the start of the root level array
            this.pairs.add(char);
          }
          break;

        case "]":
          if (this.pairs.empty()) {
            // Indicates the end of the root level array
            this.closed = true;
          } else {
            this.pairs.close(char);
            this.buffer += char;
          }
          break;

        case "{":
          this.pairs.open(char);
          this.buffer += char;
          break;

        case "}":
          this.pairs.close(char);
          this.buffer += char;
          break;

        case '"':
          if (this.pairs.previous('"') === "open") {
            this.pairs.close('"');
            this.inString = false;
          } else {
            this.pairs.open('"');
            this.inString = true;
          }
          this.buffer += char;
          break;

        case ",":
          if (this.pairs.empty()) {
            // This means that an item in the array is finished
            this.flushBuffer();
          } else {
            this.buffer += char;
          }
          break;

        default:
          this.buffer += char;
      }
    }

    if (this.closed && this.buffer) this.flushBuffer();
  }

  /**
   * Move the string currently in the buffer into the
   * list of parsable strings, then clear the buffer.
   */
  private flushBuffer(): void {
    if (!this.buffer) throw new Error("cannot flush an empty buffer");
    this.parsable.push(this.buffer);
    this.buffer = "";
  }

  /**
   * Check if the root JSON array is closed.
   */
  isClosed(): boolean {
    return this.closed;
  }

  /**
   * Attempt to parse all the parseable items that have been processed
   * and return them. Any unparseable items will be returned as `null`.
   */
  flushItems(): any[] {
    const items = this.parsable;
    this.parsable = [];
    return items.map((item) => {
      try {
        return JSON.parse(item);
      } catch (error) {
        return null;
      }
    });
  }
}

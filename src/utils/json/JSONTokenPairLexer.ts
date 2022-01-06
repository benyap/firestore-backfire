export type JSONOpenToken = "[" | "{" | '"';
export type JSONCloseToken = "]" | "}" | '"';
export type JSONPairToken = JSONOpenToken | JSONCloseToken;

type JSONPairMap = Record<JSONOpenToken, JSONCloseToken> &
  Record<JSONCloseToken, JSONOpenToken>;

type TokenAction = "open" | "close";

export class JSONTokenPairLexer {
  private readonly tokenPairMap: JSONPairMap = {
    "[": "]",
    "]": "[",
    "{": "}",
    "}": "{",
    '"': '"',
  };

  private stack: string[] = [];
  private tokens: { [token: string]: { count: number; last?: TokenAction } } = {};

  /**
   * Check if a token has been added to the lexer before.
   */
  has(token: string): boolean {
    return token in this.tokens;
  }

  /**
   * Get the last action that was taken on the token.
   */
  previous(token: JSONPairToken): TokenAction | null {
    return this.tokens[token]?.last ?? null;
  }

  /**
   * Query the number of times the token has been opened.
   */
  query(token: JSONPairToken): number | null {
    return this.tokens[token]?.count ?? null;
  }

  /**
   * Add a token to the lexer. The token is initialized with
   * a count of 0.
   */
  add(token: JSONPairToken): void {
    if (!(token in this.tokens)) this.tokens[token] = { count: 0 };
  }

  /**
   * Open a token.
   */
  open(token: JSONOpenToken): void {
    this.stack.push(token);
    this.add(token);
    this.add(this.tokenPairMap[token]);
    this.tokens[token].count += 1;
    this.tokens[token].last = "open";
  }

  /**
   * Close a token. An error is thrown if the token cannot be closed.
   */
  close(token: JSONCloseToken): void {
    const last = this.stack.pop();
    if (last === this.tokenPairMap[token]) {
      this.tokens[this.tokenPairMap[token]].count -= 1;
      this.tokens[token].last = "close";
    } else {
      // This a parsing error, but we'll just ignore it for now
      // if (last) throw new Error(`incorrectly closed ${last} with ${token}`);
      // else throw new Error(`nothing to close with ${token}`);
    }
  }

  /**
   * Returns true if there are no open tokens.
   */
  empty(): boolean {
    return this.stack.length === 0;
  }
}

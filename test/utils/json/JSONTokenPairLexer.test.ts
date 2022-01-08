import { JSONTokenPairLexer } from "~/utils/json/JSONTokenPairLexer";

describe(JSONTokenPairLexer.name, () => {
  let pairs: JSONTokenPairLexer;

  beforeEach(() => {
    pairs = new JSONTokenPairLexer();
  });

  describe("has()", () => {
    it("returns false when token does not exist", () => {
      expect(pairs.has("[")).toBe(false);
    });

    it("returns true when token exists", () => {
      pairs.add("[");
      expect(pairs.has("[")).toBe(true);
    });

    it("returns true when token > 0", () => {
      pairs.open("[");
      expect(pairs.query("[")).toBe(1);
      expect(pairs.has("[")).toBe(true);
    });
  });

  describe("previous()", () => {
    it("returns null when token does not exist", () => {
      expect(pairs.previous("[")).toBeNull();
    });

    it("returns previous consumption (null)", () => {
      pairs.add("[");
      expect(pairs.previous("[")).toBeNull();
    });

    it("returns previous consumption (open)", () => {
      pairs.open('"');
      expect(pairs.previous('"')).toBe("open");
    });

    it("returns previous consumption (close)", () => {
      pairs.open('"');
      pairs.close('"');
      expect(pairs.previous('"')).toBe("close");
    });
  });

  describe("add()", () => {
    it("adds new token", () => {
      pairs.add("[");
      expect(pairs.query("[")).toBe(0);
    });

    it("does not modify existing token", () => {
      pairs.open("[");
      pairs.add("[");
      expect(pairs.query("[")).toBe(1);
    });
  });

  describe("query()", () => {
    it("returns null for non existent token", () => {
      expect(pairs.query("[")).toBeNull;
    });

    it("returns count for existing token", () => {
      pairs.open("[");
      pairs.open("[");
      expect(pairs.query("[")).toBe(2);
    });
  });

  describe("open()", () => {
    it("opens new token", () => {
      pairs.open("[");
      expect(pairs.query("[")).toBe(1);
    });

    it("open adds to existing token", () => {
      pairs.open("[");
      pairs.open("[");
      expect(pairs.query("[")).toBe(2);
    });
  });

  describe("close()", () => {
    it("close removes from existing token", () => {
      pairs.open("[");
      pairs.open("[");
      pairs.close("]");
      expect(pairs.query("[")).toBe(1);
    });
  });

  describe("empty()", () => {
    it("returns true on start", () => {
      expect(pairs.empty()).toBe(true);
    });

    it("returns true when tokens have been closed", () => {
      pairs.open("[");
      pairs.open("[");
      pairs.close("]");
      pairs.close("]");
      expect(pairs.empty()).toBe(true);
    });

    it("returns false when there are open tokens", () => {
      pairs.open("[");
      pairs.open("[");
      pairs.close("]");
      expect(pairs.empty()).toBe(false);
    });
  });
});

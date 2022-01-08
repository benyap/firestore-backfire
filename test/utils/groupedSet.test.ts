import { GroupedSet } from "~/utils/groupedSet";

describe(GroupedSet.name, () => {
  let set: GroupedSet<string>;

  beforeEach(() => {
    set = new GroupedSet<string>();
  });

  describe("has()", () => {
    it("returns false if it does not have the group", () => {
      expect(set.has(2)).toBe(false);
    });

    it("returns true if it has the group", () => {
      set.add(1, "value");
      expect(set.has(1)).toBe(true);
    });
  });

  describe("get()", () => {
    it("returns null if the group does not exist", () => {
      expect(set.get(1)).toBeNull();
    });

    it("returns null if the group does not exist", () => {
      set.add(1, "hello");
      set.add(2, "world");
      expect(set.get(1)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
    });
  });

  describe("size()", () => {
    it("returns correct initial size", () => {
      expect(set.size()).toBe(0);
    });

    it("returns correct size after adding", () => {
      set.add(1, "hello");
      set.add(2, "world");
      expect(set.size()).toBe(2);
    });

    it("returns correct size after removing", () => {
      set.add(1, "hello");
      set.add(2, "world");
      set.remove(1, "hello");
      expect(set.size()).toBe(1);
    });

    it("returns correct size adding same item", () => {
      set.add(1, "hello");
      set.add(1, "hello");
      set.add(2, "hello");
      expect(set.size()).toBe(2);
    });

    it("returns correct size after removing non-existent item", () => {
      set.add(1, "hello");
      set.remove(1, "there");
      expect(set.size()).toBe(1);
    });
  });

  describe("numberOfGroups()", () => {
    it("returns correct number of groups", () => {
      expect(set.numberOfGroups()).toBe(0);
      set.add(1, "hello");
      set.add(1, "world");
      set.add(2, "hello");
      expect(set.numberOfGroups()).toBe(2);
      set.remove(2, "hello");
      expect(set.numberOfGroups()).toBe(1);
    });
  });

  describe("add()", () => {
    it("adds item to correct group", () => {
      set.add(1, "hello");
      set.add(2, "hello");
      expect(set.get(1)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
      expect(set.get(2)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
      expect(set.size()).toBe(2);
    });

    it("does not add the same item twice", () => {
      set.add(1, "hello");
      set.add(1, "hello");
      expect(set.get(1)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
      expect(set.size()).toBe(1);
    });
  });

  describe("remove()", () => {
    it("removes item from correct set", () => {
      set.add(1, "hello");
      set.add(1, "world");
      set.add(2, "hello");
      set.remove(1, "hello");
      expect(set.get(1)).toMatchInlineSnapshot(`
        Set {
          "world",
        }
      `);
      expect(set.get(2)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
      expect(set.size()).toBe(2);
    });

    it("removes a group when removing the last item", () => {
      set.add(1, "hello");
      expect(set.has(1)).toBe(true);
      set.remove(1, "hello");
      expect(set.has(1)).toBe(false);
      expect(set.get(1)).toBeNull();
      expect(set.size()).toBe(0);
    });

    it("does not modify set if removing non-existent item", () => {
      set.add(1, "hello");
      set.remove(1, "world");
      expect(set.get(1)).toMatchInlineSnapshot(`
        Set {
          "hello",
        }
      `);
      expect(set.size()).toBe(1);
    });
  });

  describe("pop()", () => {
    it("returns an item from correct group", () => {
      set.add(1, "hello");
      set.add(1, "world");
      set.add(2, "hello");
      set.add(2, "world");
      expect(set.pop(1)).toMatchInlineSnapshot(`"hello"`);
      expect(set.pop(1)).toMatchInlineSnapshot(`"world"`);
      expect(set.get(1)).toBeNull();
      expect(set.get(2)?.size).toBe(2);
      expect(set.size()).toBe(2);
    });

    it("returns null when the group is empty", () => {
      set.add(1, "hello");
      expect(set.pop(1)).toMatchInlineSnapshot(`"hello"`);
      expect(set.pop(1)).toBeNull();
      expect(set.size()).toBe(0);
    });
  });

  describe("popFromAny()", () => {
    it("pops items", () => {
      set.add(1, "hello");
      set.add(2, "world");
      set.add(3, "hello");
      set.add(3, "there");
      expect(set.popFromAny(2)).toHaveLength(2);
      expect(set.size()).toBe(2);
      expect(set.has(1)).toBe(false);
      expect(set.has(2)).toBe(false);
      expect(set.has(3)).toBe(true);
    });

    it("pops as many items as possible if not enough", () => {
      set.add(1, "hello");
      set.add(2, "world");
      expect(set.popFromAny(10)).toHaveLength(2);
      expect(set.size()).toBe(0);
    });
  });

  describe("removeGroup()", () => {
    it("removes the items in the group", () => {
      set.add(1, "hello");
      set.add(2, "world");
      set.add(3, "hello");
      set.add(3, "there");
      expect(set.numberOfGroups()).toBe(3);
      set.removeGroup(3);
      expect(set.size()).toBe(2);
      expect(set.get(3)).toBeNull();
      expect(set.numberOfGroups()).toBe(2);
    });
  });
});

import {
  deleteFieldByPath,
  getValueByPath,
  setValueByPath,
} from "~/utils/objectPath";

describe(getValueByPath.name, () => {
  let object: any;

  beforeEach(() => {
    object = {
      hello: "world",
      details: {
        description: "something",
        counts: [{ value: 5 }, { value: 10 }],
      },
    };
  });

  it("gets existing top level path", () => {
    expect(getValueByPath(object, "hello")).toEqual("world");
  });

  it("gets non-existent top level path", () => {
    expect(getValueByPath(object, "there")).toBeUndefined();
  });

  it("gets deep path", () => {
    expect(getValueByPath(object, "details.description")).toEqual("something");
  });

  it("gets non-existent deep path", () => {
    expect(getValueByPath(object, "hello.world")).toBeUndefined();
  });

  it("gets non-existent deep path (multiple levels deep)", () => {
    expect(getValueByPath(object, "hello.there.world")).toBeUndefined();
  });

  it("gets array path", () => {
    expect(getValueByPath(object, "details.counts.1.value")).toEqual(10);
  });
});

describe(setValueByPath.name, () => {
  let object: any;

  beforeEach(() => {
    object = {
      hello: "world",
      details: {
        description: "something",
        counts: [{ value: 5 }, { value: 10 }],
      },
    };
  });

  it("sets value for existing top level path", () => {
    setValueByPath(object, "hello", "there");
    expect(object).toMatchSnapshot();
  });

  it("sets value for non-existent top level path", () => {
    setValueByPath(object, "there", "hello");
    expect(object).toMatchSnapshot();
  });

  it("does not modify object when given non-existent top level path and createMissingKeys is false", () => {
    setValueByPath(object, "there", "hello", { createMissingKeys: false });
    expect(object).toMatchSnapshot();
  });

  it("sets value for existing nested path", () => {
    setValueByPath(object, "details.description", "anything");
    expect(object).toMatchSnapshot();
  });

  it("sets value for non-existent nested path", () => {
    setValueByPath(object, "details.title", "fabulous");
    expect(object).toMatchSnapshot();
  });

  it("sets value for existing array path", () => {
    setValueByPath(object, "details.counts.0.value", 7);
    expect(object).toMatchSnapshot();
  });

  it("sets value for non-existent array path", () => {
    setValueByPath(object, "details.counts.4", { description: "custom", value: 4 });
    expect(object).toMatchSnapshot();
  });

  it("does not modify object when given non-existent nested path and createMissingKeys is false", () => {
    setValueByPath(object, "details.counts", "hello", { createMissingKeys: false });
    expect(object).toMatchSnapshot();
  });
});

describe(deleteFieldByPath.name, () => {
  let object: any;

  beforeEach(() => {
    object = {
      hello: "world",
      details: {
        description: "something",
        counts: [{ value: 5 }, { value: 10 }],
      },
    };
  });

  it("deletes top level path", () => {
    deleteFieldByPath(object, "details");
    expect(object).toMatchSnapshot();
  });

  it("does not modify object when deleting non-existent top level path", () => {
    deleteFieldByPath(object, "nothing");
    expect(object).toMatchSnapshot();
  });

  it("deletes nested path", () => {
    deleteFieldByPath(object, "details.counts");
    expect(object).toMatchSnapshot();
  });

  it("deletes nested array path", () => {
    deleteFieldByPath(object, "details.counts.1.value");
    expect(object).toMatchSnapshot();
  });

  it("does not modify object when deleting non-existent nested array path", () => {
    deleteFieldByPath(object, "details.counts.1.something");
    expect(object).toMatchSnapshot();
  });
});

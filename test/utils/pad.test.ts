import { padNumberStart } from "~/utils/pad";

describe(padNumberStart.name, () => {
  it("pads integers correctly", () => {
    expect(padNumberStart(12, 4)).toMatchInlineSnapshot(`"0012"`);
  });

  it("pads decimals correctly", () => {
    expect(padNumberStart(12.4, 3)).toMatchInlineSnapshot(`"012.4"`);
  });

  it("does not pad when there are enough digits", () => {
    expect(padNumberStart(123.45, 2)).toMatchInlineSnapshot(`"123.45"`);
  });
});

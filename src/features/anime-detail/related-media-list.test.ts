import { formatRelationType } from "./related-media-list";

describe("formatRelationType", () => {
  it("converts a SCREAMING_SNAKE_CASE enum value to Title Case words", () => {
    expect(formatRelationType("SIDE_STORY")).toBe("Side Story");
    expect(formatRelationType("SEQUEL")).toBe("Sequel");
    expect(formatRelationType("ALTERNATIVE_VERSION")).toBe("Alternative Version");
  });

  it("returns an empty string for a missing relation type", () => {
    expect(formatRelationType(null)).toBe("");
    expect(formatRelationType(undefined)).toBe("");
  });
});

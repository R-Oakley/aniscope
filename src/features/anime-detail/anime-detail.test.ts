import { stripDescriptionHtml } from "./anime-detail";

describe("stripDescriptionHtml", () => {
  it("converts <br> variants into real newlines", () => {
    expect(stripDescriptionHtml("Line one<br><br>\nLine two")).toBe(
      "Line one\n\nLine two",
    );
    expect(stripDescriptionHtml("A<br/>B<br />C")).toBe("A\nB\nC");
  });

  it("strips inline tags entirely, keeping their text content", () => {
    expect(stripDescriptionHtml("<b>*Special note</b>")).toBe("*Special note");
  });

  it("collapses runs of 3+ newlines down to a single paragraph break", () => {
    expect(stripDescriptionHtml("A<br><br><br><br>B")).toBe("A\n\nB");
  });

  it("handles a real AniList description containing raw HTML (One Piece, id 21)", () => {
    const raw =
      "Gold Roger was known as the Pirate King.<br><br>\n" +
      "Enter Monkey D. Luffy, a 17-year-old boy.<br><br>\n" +
      "<b>*This includes the following special episodes:</b><br>\n" +
      "- Chopperman to the Rescue! (Episode 336)<br>";

    const result = stripDescriptionHtml(raw);

    expect(result).not.toContain("<br");
    expect(result).not.toContain("<b>");
    expect(result).toContain("Gold Roger was known as the Pirate King.");
    expect(result).toContain("*This includes the following special episodes:");
  });
});

import { searchAnimeQueryOptions } from "./query-options";

// No rendering involved here — searchAnimeQueryOptions is a plain function
// returning a config object, so a plain function test is the right (and
// fastest) tool. No React Testing Library needed.
describe("searchAnimeQueryOptions", () => {
  it("disables the query for an empty or whitespace-only search term", () => {
    expect(searchAnimeQueryOptions("").enabled).toBe(false);
    expect(searchAnimeQueryOptions("   ").enabled).toBe(false);
  });

  it("enables the query and trims the term for the cache key", () => {
    const options = searchAnimeQueryOptions("  naruto  ");

    expect(options.enabled).toBe(true);
    expect(options.queryKey).toEqual(["anime", "search", "naruto"]);
  });
});

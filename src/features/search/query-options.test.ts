import { anilistClient } from "@/lib/anilist/client";

import { searchAnimeQueryOptions } from "./query-options";

// anilistClient.request would make a real network call otherwise — mocking
// the client (not the hook, not fetch) keeps this a pure test of our own
// logic: what variables do we send for a given input?
jest.mock("@/lib/anilist/client", () => ({
  anilistClient: { request: jest.fn() },
}));

// No rendering involved here — searchAnimeQueryOptions is a plain function
// returning a config object, so a plain function test is the right (and
// fastest) tool. No React Testing Library needed.
describe("searchAnimeQueryOptions", () => {
  it("disables the query for an empty or whitespace-only search term with no filters", () => {
    expect(searchAnimeQueryOptions("").enabled).toBe(false);
    expect(searchAnimeQueryOptions("   ").enabled).toBe(false);
  });

  it("enables the query and trims the term for the cache key", () => {
    const options = searchAnimeQueryOptions("  naruto  ");

    expect(options.enabled).toBe(true);
    expect(options.queryKey).toEqual([
      "anime",
      "search",
      "naruto",
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it("enables the query when a filter is set even with no search text", () => {
    const options = searchAnimeQueryOptions("", { genre: "Action" });

    expect(options.enabled).toBe(true);
  });

  it("sends undefined, not an empty string, as the search variable when there is no text", async () => {
    const requestMock = anilistClient.request as jest.Mock;
    requestMock.mockResolvedValue({ Page: { media: [] } });

    const options = searchAnimeQueryOptions("   ", { genre: "Action" });
    // queryFn's real signature takes a TanStack QueryFunctionContext, but our
    // implementation ignores it — a loose context stand-in is enough here.
    await options.queryFn?.({ queryKey: options.queryKey } as never);

    // AniList treats search: "" as "match nothing" rather than "no filter" —
    // this asserts we never send the empty string it would misinterpret.
    expect(requestMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ query: undefined, genre: "Action" }),
    );
  });
});

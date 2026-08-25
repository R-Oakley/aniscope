import { infiniteQueryOptions } from "@tanstack/react-query";

import { anilistClient } from "@/lib/anilist/client";

import { searchAnimeQuery } from "./queries";
import type { SearchAnimeQueryVariables } from "@/lib/anilist/generated/graphql";

export type SearchFilters = Pick<
  SearchAnimeQueryVariables,
  "genre" | "format" | "status" | "season"
>;

export function searchAnimeQueryOptions(query: string, filters: SearchFilters = {}) {
  const trimmed = query.trim();
  const { genre, format, status, season } = filters;

  return infiniteQueryOptions({
    // Page number is deliberately NOT part of the key — useInfiniteQuery
    // tracks fetched pages itself. The key only needs to distinguish
    // different *searches*, not different *pages* of the same search.
    queryKey: ["anime", "search", trimmed, genre, format, status, season] as const,
    queryFn: ({ pageParam }) =>
      anilistClient.request(searchAnimeQuery, {
        // AniList treats search: "" as "match nothing", not "no filter" — so
        // an empty/whitespace-only term must be sent as undefined, not "",
        // or filter-only browsing (no typed text) would silently return zero
        // results. Verified this against the live API before relying on it.
        query: trimmed || undefined,
        page: pageParam,
        perPage: 20,
        genre,
        format,
        status,
        season,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.Page?.pageInfo?.hasNextPage ? lastPageParam + 1 : undefined,
    enabled: trimmed.length > 0 || Boolean(genre || format || status || season),
  });
}

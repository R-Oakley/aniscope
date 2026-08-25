import { queryOptions } from "@tanstack/react-query";

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

  return queryOptions({
    queryKey: ["anime", "search", trimmed, genre, format, status, season] as const,
    queryFn: () =>
      anilistClient.request(searchAnimeQuery, {
        // AniList treats search: "" as "match nothing", not "no filter" — so
        // an empty/whitespace-only term must be sent as undefined, not "",
        // or filter-only browsing (no typed text) would silently return zero
        // results. Verified this against the live API before relying on it.
        query: trimmed || undefined,
        perPage: 20,
        genre,
        format,
        status,
        season,
      }),
    enabled: trimmed.length > 0 || Boolean(genre || format || status || season),
  });
}

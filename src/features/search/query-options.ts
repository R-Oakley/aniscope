import { queryOptions } from "@tanstack/react-query";

import { anilistClient } from "@/lib/anilist/client";

import { searchAnimeQuery } from "./queries";

export function searchAnimeQueryOptions(query: string) {
  const trimmed = query.trim();

  return queryOptions({
    queryKey: ["anime", "search", trimmed] as const,
    queryFn: () =>
      anilistClient.request(searchAnimeQuery, { query: trimmed, perPage: 20 }),
    enabled: trimmed.length > 0,
  });
}

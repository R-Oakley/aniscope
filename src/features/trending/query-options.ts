import { queryOptions } from "@tanstack/react-query";

import { anilistClient } from "@/lib/anilist/client";

import { trendingAnimeQuery } from "./queries";

export function trendingAnimeQueryOptions(perPage: number) {
  return queryOptions({
    queryKey: ["anime", "trending", perPage] as const,
    queryFn: () => anilistClient.request(trendingAnimeQuery, { perPage }),
  });
}

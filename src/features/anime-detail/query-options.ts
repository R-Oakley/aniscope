import { queryOptions } from "@tanstack/react-query";

import { anilistClient } from "@/lib/anilist/client";

import {
  animeCharactersQuery,
  animeDetailQuery,
  animeRecommendationsQuery,
  animeRelationsQuery,
} from "./queries";

export function animeDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["anime", "detail", id] as const,
    queryFn: () => anilistClient.request(animeDetailQuery, { id }),
  });
}

export function animeCharactersQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["anime", "detail", id, "characters"] as const,
    queryFn: () => anilistClient.request(animeCharactersQuery, { id }),
  });
}

export function animeRelationsQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["anime", "detail", id, "relations"] as const,
    queryFn: () => anilistClient.request(animeRelationsQuery, { id }),
  });
}

export function animeRecommendationsQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["anime", "detail", id, "recommendations"] as const,
    queryFn: () => anilistClient.request(animeRecommendationsQuery, { id }),
  });
}

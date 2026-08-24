import { queryOptions } from "@tanstack/react-query";

import { anilistClient } from "@/lib/anilist/client";

import { animeDetailQuery } from "./queries";

export function animeDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["anime", "detail", id] as const,
    queryFn: () => anilistClient.request(animeDetailQuery, { id }),
  });
}

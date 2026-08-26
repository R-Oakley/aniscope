import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

import { getQueryClient } from "@/lib/query/get-query-client";

import { trendingAnimeQueryOptions } from "./query-options";
import { TrendingAnimeList } from "./trending-anime-list";

export async function TrendingAnimeSection({ perPage }: { perPage: number }) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trendingAnimeQueryOptions(perPage));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TrendingAnimeSkeleton perPage={perPage} />}>
        <TrendingAnimeList perPage={perPage} />
      </Suspense>
    </HydrationBoundary>
  );
}

export function TrendingAnimeSkeleton({ perPage }: { perPage: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {Array.from({ length: perPage }).map((_, i) => (
        <li
          key={i}
          className="aspect-2/3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </ul>
  );
}

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getQueryClient } from "@/lib/query/get-query-client";

import { AnimeDetail } from "./anime-detail";
import { CharactersList } from "./characters-list";
import {
  animeCharactersQueryOptions,
  animeDetailQueryOptions,
  animeRecommendationsQueryOptions,
  animeRelationsQueryOptions,
} from "./query-options";
import { RecommendationsList } from "./recommendations-list";
import { RelatedMediaList } from "./related-media-list";

export async function AnimeDetailSection({ id }: { id: number }) {
  const queryClient = getQueryClient();
  const options = animeDetailQueryOptions(id);
  await queryClient.prefetchQuery(options);

  // Prefetch already resolved above, so this reads the cache synchronously
  // rather than fetching again — just used to decide whether this id exists.
  const data = queryClient.getQueryData(options.queryKey);
  if (!data?.Media) {
    notFound();
  }

  // Deliberately NOT awaited: these three stream into the response
  // independently as each resolves, instead of blocking the whole page
  // (including the already-resolved hero content above) on the slowest of
  // them. The `pending`-status clause in get-query-client.ts's
  // shouldDehydrateQuery is what makes an un-awaited prefetch like this
  // still reach the client via the hydration payload. The .catch() only
  // stops Node from logging an unhandled-rejection warning here; if one of
  // these fails, the client retries fresh after mount, and if that also
  // fails, error.tsx (this route's error boundary) is what catches it now.
  queryClient.prefetchQuery(animeCharactersQueryOptions(id)).catch(() => {});
  queryClient.prefetchQuery(animeRelationsQueryOptions(id)).catch(() => {});
  queryClient
    .prefetchQuery(animeRecommendationsQueryOptions(id))
    .catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-10">
        <Suspense fallback={<AnimeDetailSkeleton />}>
          <AnimeDetail id={id} />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <CharactersList id={id} />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <RelatedMediaList id={id} />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <RecommendationsList id={id} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export function AnimeDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="h-72 w-48 shrink-0 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-24 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="aspect-2/3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

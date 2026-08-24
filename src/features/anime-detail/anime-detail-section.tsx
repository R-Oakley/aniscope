import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getQueryClient } from "@/lib/query/get-query-client";

import { AnimeDetail } from "./anime-detail";
import { animeDetailQueryOptions } from "./query-options";

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AnimeDetailSkeleton />}>
        <AnimeDetail id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}

function AnimeDetailSkeleton() {
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

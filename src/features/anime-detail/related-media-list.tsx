"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimeCard } from "@/components/anime-card";

import { animeRelationsQueryOptions } from "./query-options";

export function formatRelationType(relationType: string | null | undefined) {
  if (!relationType) return "";
  return relationType
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function RelatedMediaList({ id }: { id: number }) {
  const { data } = useSuspenseQuery(animeRelationsQueryOptions(id));
  const edges = data.Media?.relations?.edges ?? [];

  if (edges.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Related</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {edges.map(
          (edge) =>
            edge?.node && (
              <li key={edge.node.id} className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-wide text-zinc-400">
                  {formatRelationType(edge.relationType)}
                </p>
                <AnimeCard anime={edge.node} />
              </li>
            ),
        )}
      </ul>
    </section>
  );
}

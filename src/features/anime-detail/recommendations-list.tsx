"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimeCard } from "@/components/anime-card";

import { animeRecommendationsQueryOptions } from "./query-options";

export function RecommendationsList({ id }: { id: number }) {
  const { data } = useSuspenseQuery(animeRecommendationsQueryOptions(id));
  const nodes = data.Media?.recommendations?.nodes ?? [];

  if (nodes.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recommendations</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {nodes.map(
          (node) =>
            node?.mediaRecommendation && (
              <li key={node.mediaRecommendation.id}>
                <AnimeCard anime={node.mediaRecommendation} />
              </li>
            ),
        )}
      </ul>
    </section>
  );
}

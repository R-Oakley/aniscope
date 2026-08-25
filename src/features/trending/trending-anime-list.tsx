"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimeCard } from "@/components/anime-card";

import { trendingAnimeQueryOptions } from "./query-options";

export function TrendingAnimeList({ perPage }: { perPage: number }) {
  const { data } = useSuspenseQuery(trendingAnimeQueryOptions(perPage));
  const media = data.Page?.media ?? [];

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {media.map(
        (anime) =>
          anime && (
            <li key={anime.id}>
              <AnimeCard anime={anime} />
            </li>
          ),
      )}
    </ul>
  );
}

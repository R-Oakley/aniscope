"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { AnimeCard } from "@/components/anime-card";

import { searchAnimeQueryOptions } from "./query-options";

export function SearchResults() {
  const query = useSearchParams().get("q") ?? "";
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...searchAnimeQueryOptions(query),
    placeholderData: keepPreviousData,
  });

  if (!query.trim()) {
    return <p className="text-zinc-500">Start typing to search anime.</p>;
  }

  if (isLoading) {
    return <p className="text-zinc-500">Searching…</p>;
  }

  const media = data?.Page?.media ?? [];

  if (media.length === 0) {
    return <p className="text-zinc-500">No results for &quot;{query}&quot;.</p>;
  }

  return (
    <ul
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 ${
        isPlaceholderData ? "opacity-50" : ""
      }`}
    >
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

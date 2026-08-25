"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { AnimeCard } from "@/components/anime-card";

import { searchAnimeQueryOptions, type SearchFilters } from "./query-options";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // Cast is safe: these values only ever come from FilterBar's own option
  // lists, which are drawn from AniList's real enum values.
  const filters: SearchFilters = {
    genre: searchParams.get("genre") ?? undefined,
    format: (searchParams.get("format") as SearchFilters["format"]) ?? undefined,
    status: (searchParams.get("status") as SearchFilters["status"]) ?? undefined,
    season: (searchParams.get("season") as SearchFilters["season"]) ?? undefined,
  };
  const hasFilters = Object.values(filters).some(Boolean);

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...searchAnimeQueryOptions(query, filters),
    placeholderData: keepPreviousData,
  });

  if (!query.trim() && !hasFilters) {
    return (
      <p className="text-zinc-500">Start typing or choose a filter to browse anime.</p>
    );
  }

  if (isLoading) {
    return <p className="text-zinc-500">Searching…</p>;
  }

  const media = data?.Page?.media ?? [];

  if (media.length === 0) {
    return (
      <p className="text-zinc-500">
        {query.trim() ? `No results for "${query}".` : "No anime match these filters."}
      </p>
    );
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

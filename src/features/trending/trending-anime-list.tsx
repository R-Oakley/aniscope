"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { trendingAnimeQueryOptions } from "./query-options";

export function TrendingAnimeList({ perPage }: { perPage: number }) {
  const { data } = useSuspenseQuery(trendingAnimeQueryOptions(perPage));
  const media = data.Page?.media ?? [];

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {media.map((anime) => {
        if (!anime) return null;
        const title = anime.title?.english ?? anime.title?.romaji ?? "Untitled";

        return (
          <li key={anime.id}>
            <Link href={`/anime/${anime.id}`} className="flex flex-col gap-2">
              {anime.coverImage?.large && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={anime.coverImage.large}
                  alt={title}
                  className="aspect-2/3 w-full rounded object-cover"
                />
              )}
              <div className="text-sm">
                <p className="font-medium leading-tight">{title}</p>
                <p className="text-zinc-500">
                  {anime.format ?? "Unknown"} · {anime.episodes ?? "?"} ep ·{" "}
                  {anime.averageScore ?? "?"}%
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";

export interface AnimeCardData {
  id: number;
  title?: { romaji?: string | null; english?: string | null } | null;
  coverImage?: { large?: string | null } | null;
  format?: string | null;
  episodes?: number | null;
  averageScore?: number | null;
}

export function AnimeCard({ anime }: { anime: AnimeCardData }) {
  const title = anime.title?.english ?? anime.title?.romaji ?? "Untitled";

  return (
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
  );
}

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { animeDetailQueryOptions } from "./query-options";

// AniList's `description(asHtml: false)` does NOT strip HTML — it returns
// the raw stored text as-is, which frequently contains literal tags
// (<br>, <b>, etc.) typed directly into the description by whoever wrote
// it. This converts <br> variants to real newlines (rendered via
// whitespace-pre-line) and strips everything else. We deliberately never
// use asHtml: true + dangerouslySetInnerHTML here — that would mean
// trusting third-party API content as safe HTML. Rendering the stripped
// result as a plain string keeps this safe regardless of what's stripped:
// React always escapes string children, so no HTML in this text can ever
// be interpreted as markup.
export function stripDescriptionHtml(description: string): string {
  return description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|ul|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AnimeDetail({ id }: { id: number }) {
  const { data } = useSuspenseQuery(animeDetailQueryOptions(id));
  const media = data.Media;

  // The server section already calls notFound() when media is missing, so in
  // practice this component only ever renders with data present.
  if (!media) return null;

  const title = media.title?.english ?? media.title?.romaji ?? "Untitled";
  const studioNames = media.studios?.nodes
    ?.map((studio) => studio?.name)
    .filter(Boolean)
    .join(", ");
  const releaseDate = media.startDate?.year
    ? [media.startDate.year, media.startDate.month, media.startDate.day]
        .filter(Boolean)
        .join("-")
    : null;

  return (
    <article>
      {media.bannerImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.bannerImage}
          alt=""
          className="mb-6 h-48 w-full rounded object-cover"
        />
      )}
      <div className="flex flex-col gap-6 sm:flex-row">
        {media.coverImage?.large && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.coverImage.large}
            alt={title}
            className="w-48 shrink-0 rounded object-cover"
          />
        )}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-zinc-500">
            {[
              media.format,
              media.status,
              media.episodes ? `${media.episodes} episodes` : null,
              media.duration ? `${media.duration} min` : null,
              releaseDate,
              studioNames,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {media.genres && media.genres.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {media.genres.map(
                (genre) =>
                  genre && (
                    <li
                      key={genre}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800"
                    >
                      {genre}
                    </li>
                  ),
              )}
            </ul>
          )}
          {media.averageScore != null && (
            <p className="text-sm font-medium">
              Average score: {media.averageScore}%
            </p>
          )}
          {media.description && (
            <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {stripDescriptionHtml(media.description)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

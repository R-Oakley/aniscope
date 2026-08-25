"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Hardcoded against AniList's live GenreCollection, verified directly against
// the API rather than assumed. "Hentai" is deliberately excluded, consistent
// with the isAdult: false filter already applied to every query in this app.
const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

// Only the formats that apply to type: ANIME — MediaFormat also includes
// manga-only values (MANGA, NOVEL, ONE_SHOT) that would just return zero
// results here, so they're left out of this list entirely.
const FORMATS = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Music" },
];

const STATUSES = [
  { value: "FINISHED", label: "Finished" },
  { value: "RELEASING", label: "Releasing" },
  { value: "NOT_YET_RELEASED", label: "Not Yet Released" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "HIATUS", label: "Hiatus" },
];

const SEASONS = [
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

function FilterSelect({
  paramKey,
  label,
  options,
  value,
  onChange,
}: {
  paramKey: string;
  label: string;
  options: string[] | { value: string; label: string }[];
  value: string;
  onChange: (paramKey: string, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(paramKey, e.target.value)}
        className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <option value="">All</option>
        {options.map((option) => {
          const opt = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilterChange(paramKey: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <FilterSelect
        paramKey="genre"
        label="Genre"
        options={GENRES}
        value={searchParams.get("genre") ?? ""}
        onChange={handleFilterChange}
      />
      <FilterSelect
        paramKey="format"
        label="Format"
        options={FORMATS}
        value={searchParams.get("format") ?? ""}
        onChange={handleFilterChange}
      />
      <FilterSelect
        paramKey="status"
        label="Status"
        options={STATUSES}
        value={searchParams.get("status") ?? ""}
        onChange={handleFilterChange}
      />
      <FilterSelect
        paramKey="season"
        label="Season"
        options={SEASONS}
        value={searchParams.get("season") ?? ""}
        onChange={handleFilterChange}
      />
    </div>
  );
}

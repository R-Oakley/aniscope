"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Render-time resync, not an effect: if `q` changed in the URL for a
  // reason other than our own debounced write below (e.g. the browser
  // Back/Forward buttons), pick that up immediately. Calling setState
  // conditionally during render like this is React's documented way to
  // adjust state in response to a prop/external change — React re-renders
  // before committing, so there's no extra frame showing the stale value
  // the way an effect-based resync would produce.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  // Cleanup only — registers nothing on mount, just guarantees a pending
  // debounce timer doesn't fire after this component has unmounted (e.g. the
  // user navigates away mid-debounce). Not "useEffect for derived state" (the
  // pattern this project avoids elsewhere): it reads no external system and
  // computes nothing, it only tears down a non-React resource on unmount.
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleChange(next: string) {
    setValue(next);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const trimmed = next.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, DEBOUNCE_MS);
  }

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search anime..."
      className="w-full max-w-md rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
    />
  );
}

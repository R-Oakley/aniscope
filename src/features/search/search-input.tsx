"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

const DEBOUNCE_MS = 400;

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

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

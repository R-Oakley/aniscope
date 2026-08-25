import { Suspense } from "react";

import { SearchInput } from "@/features/search/search-input";
import { SearchResults } from "@/features/search/search-results";

export default function SearchPage() {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Search</h1>
      <Suspense fallback={<p className="text-zinc-500">Loading search…</p>}>
        <div className="flex flex-col gap-6">
          <SearchInput />
          <SearchResults />
        </div>
      </Suspense>
    </main>
  );
}

import { TrendingAnimeSkeleton } from "@/features/trending/trending-anime-section";

export default function Loading() {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Trending Anime</h1>
      <TrendingAnimeSkeleton perPage={10} />
    </main>
  );
}

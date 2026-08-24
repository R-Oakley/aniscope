import { notFound } from "next/navigation";

import { AnimeDetailSection } from "@/features/anime-detail/anime-detail-section";

export default async function AnimeDetailPage({
  params,
}: PageProps<"/anime/[id]">) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    notFound();
  }

  return (
    <main className="flex-1 px-8 py-12">
      <AnimeDetailSection id={numericId} />
    </main>
  );
}

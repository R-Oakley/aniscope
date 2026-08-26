import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-2 text-xl font-semibold">Anime not found</h1>
      <p className="mb-4 text-zinc-500">
        This anime doesn&apos;t exist, or isn&apos;t available.
      </p>
      <Link href="/" className="text-sm underline">
        Back to trending
      </Link>
    </main>
  );
}

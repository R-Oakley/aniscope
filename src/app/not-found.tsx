import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-2 text-xl font-semibold">Page not found</h1>
      <p className="mb-4 text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-sm underline">
        Back to trending
      </Link>
    </main>
  );
}

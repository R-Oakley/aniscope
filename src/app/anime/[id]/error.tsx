"use client";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
      <p className="mb-4 text-zinc-500">We couldn&apos;t load this anime right now.</p>
      <button
        onClick={() => retry()}
        className="rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
      >
        Try again
      </button>
    </main>
  );
}

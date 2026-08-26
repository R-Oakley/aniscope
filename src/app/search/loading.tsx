export default function Loading() {
  return (
    <main className="flex-1 px-8 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Search</h1>
      <div className="flex flex-col gap-6">
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

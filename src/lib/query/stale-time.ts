// Shared between get-query-client.ts (server prefetch client) and
// providers.tsx (browser client). These must agree: if the server prefetches
// with one staleTime and the browser hydrates with a shorter one, hydrated
// data reads as immediately stale and refetches on mount, defeating the
// prefetch.
export const QUERY_STALE_TIME_MS = 60 * 1000;

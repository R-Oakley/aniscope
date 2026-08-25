# AniScope Implementation Plan

This is the living state doc for the AniScope learning project. If context gets cleared,
read this file first — it should be enough to resume without re-deriving decisions already made.
The original requirements are in `docs/Prompts/first-prompt.txt`; this file tracks *how* we're
executing against them.

## Working agreement

- Small vertical slices only. Don't build ahead of the current slice.
- Before implementing a slice, explain: what runs on the server vs the client, where state
  lives, how TanStack Query is involved, and what GraphQL operation is needed.
- The user is learning Next.js App Router, React Server/Client Components, TanStack Query, and
  GraphQL — they are not assumed to already know these. Explain the *why*, not just the *what*,
  and connect new code back to concepts already covered.
- After explaining a slice, ask comprehension questions before moving on. Don't just proceed
  because the code works — confirm understanding.
- Keep this file updated after every slice: move it from "Up next" to "Done" with a short
  description and file list, and log what was explained/confirmed in the comprehension log.

## Framework notes (Next.js 16.3.1)

Per `AGENTS.md`, this Next.js version has real breaking changes vs. typical training data — the
bundled docs at `node_modules/next/dist/docs/` are the source of truth, not prior knowledge.
Confirmed so far:

- `fetch()` is **not cached by default**, regardless of Cache Components. Opt in per-request
  with `{ cache: 'force-cache' }`, or use the newer `'use cache'` directive.
- **Cache Components** (`cacheComponents: true` in `next.config.ts`, the `use cache`/`cacheLife`
  model) exists in this version but is **deliberately deferred** — decided with the user when
  starting slice 1. Revisit as its own slice later, once RSC/TanStack fundamentals are solid.
- `params` / `searchParams` in route props are `Promise`s (`await params`). Route prop types come
  from generated helpers like `LayoutProps<'/'>` / `PageProps<'/anime/[id]'>`.

## Architecture decisions

- **Feature-based folders**: `src/features/<feature>/` holds everything for a feature
  (query options, server section component, client component). `src/app/` stays routing-only.
- **GraphQL / Codegen**: using the `@graphql-codegen/client-preset` workflow — queries are
  written inline with the generated `graphql()` tag in `.ts` files (not standalone `.graphql`
  files), e.g. `src/features/trending/queries.ts`. Run `npm run codegen` after adding or editing
  any query. Generated output lives in `src/lib/anilist/generated/` and is committed (it's
  derived but small, and committing it means the project type-checks without a network call).
- **AniList client**: one `graphql-request` `GraphQLClient` at `src/lib/anilist/client.ts`,
  pointed at `https://graphql.anilist.co`. AniList's read API needs no auth, so this same client
  is safe to reuse on both the server and the browser.
- **TanStack Query pattern** (established in slice 2 — reuse this shape for every future feature
  that reads AniList data):
  - `src/lib/query/get-query-client.ts` — a **per-request** `QueryClient`, built with
    `React.cache()`, used only in Server Components.
  - `src/lib/query/providers.tsx` — the browser `QueryClientProvider`, mounted once in the root
    layout.
  - Per feature, a `query-options.ts` exporting a `xQueryOptions(...)` function built with
    TanStack's `queryOptions()` helper — the single definition of `queryKey` + `queryFn`, shared
    between the server's `prefetchQuery` and the client's `useQuery`/`useSuspenseQuery`.
  - Per feature, a **Server "section" component** that gets the request's `QueryClient`,
    `await`s `prefetchQuery(...)`, and renders `<HydrationBoundary><Suspense><ClientPart />
    </Suspense></HydrationBoundary>`.
  - Per feature, a **Client component** (`'use client'`) that calls `useSuspenseQuery` (or
    `useQuery`/`useInfiniteQuery` once there's real client-driven interactivity) against the same
    query options, and renders the UI.
- **State placement rule**:
  - URL `searchParams` — anything shareable/server-readable: search text, filters, page/cursor.
  - TanStack Query cache — all AniList data. Never copied into `useState`.
  - Local `useState` — only for pure UI state with no server meaning (e.g. a dropdown's open
    state).
- **No `useEffect` for data fetching**, ever — Server Component `await`/`prefetchQuery` or
  TanStack Query hooks cover every case in this app.

## Slice status

### Done

- **Slice 1 — GraphQL pipeline, no TanStack Query.** Proved the GraphQL → codegen → render
  pipeline in isolation. `codegen.ts`, `src/lib/anilist/client.ts`,
  `src/features/trending/queries.ts` (the `TrendingAnime` operation), trending list rendered
  directly (`await`) in a Server Component.
- **Slice 2 — TanStack Query prefetch + hydration for trending.** Split the trending feature into
  a Server "section" (prefetch + hydrate) and a Client "list" (`useSuspenseQuery`). Added
  `src/lib/query/get-query-client.ts`, `src/lib/query/providers.tsx` (mounted in
  `src/app/layout.tsx`), `src/features/trending/query-options.ts`,
  `src/features/trending/trending-anime-section.tsx` (server),
  `src/features/trending/trending-anime-list.tsx` (now client).
- **Slice 3 — Anime detail page (`/anime/[id]`).** Dynamic route, `await params`, new
  `AnimeDetail` GraphQL query (core fields only — no characters/relations/recommendations, that's
  slice 7). Deliberately reused the slice-2 TanStack Query pattern here (not a plain server-only
  fetch). **Correction from the original pitch**: this does *not* avoid refetching on repeat
  visits — `AnimeDetailSection` is a Server Component, so every render gets a brand-new
  per-request `QueryClient` (via `React.cache()`) with zero visibility into the browser's
  long-lived `QueryClient`; `prefetchQuery` hits AniList on every server render regardless of
  what the browser already has cached. The real, current benefit is the same as slice 2's:
  avoiding the *double*-fetch (server fetch + a redundant client fetch on mount). The
  repeat-visit/cross-navigation benefit only becomes real once something client-side reads this
  query key without a full server re-render (e.g. a future hover-prefetch on trending cards, or
  another client component sharing the query) — the plumbing is in place for that, just not
  exercised yet. Added
  `src/features/anime-detail/queries.ts`, `query-options.ts`, `anime-detail-section.tsx` (server:
  prefetch, then reads the cache back with `getQueryData` to call `notFound()` if the id doesn't
  exist, before ever rendering the client part), `anime-detail.tsx` (client, `useSuspenseQuery`),
  `src/app/anime/[id]/page.tsx` (parses/validates the numeric id, 404s on non-numeric ids). Also
  wrapped each trending card in `next/link` so the route is reachable from the UI.

- **Slice 4 — Search.** Fully client-driven, no server prefetch at all (there's no default search
  term to prefetch). `src/features/search/search-input.tsx` (client): local `useState` for
  instant keystroke echo, debounced via a `setTimeout` held in a `ref` (reset inside `onChange`,
  not `useEffect` — this reacts to a single event, not to synchronizing with an external system on
  mount), commits to the URL (`?q=`) via `router.replace(..., { scroll: false })`.
  `src/features/search/search-results.tsx` (client): reads `useSearchParams().get('q')`, uses
  plain `useQuery` (not `useSuspenseQuery` — "no query typed" is a real empty state, not a loading
  state, and `enabled: false` needs plain `useQuery`) with `placeholderData: keepPreviousData` so
  results don't flash to blank between keystrokes. Added `src/components/anime-card.tsx`, a shared
  presentational component extracted from trending + search's near-identical card markup (real
  dedup, two call sites) — deliberately did **not** extract a shared GraphQL fragment for the two
  queries' field selections yet (would be premature with only two consumers; revisit once a third
  shows up, e.g. recommendations in slice 7). Added a small nav in `src/app/layout.tsx` so
  `/search` is reachable.

- **Out-of-band fix — adult content filtering.** User flagged mature content appearing in search
  results in a work environment. Added `isAdult: false` as a hardcoded query argument (not a
  variable/toggle — deliberately simple, a fixed safe default rather than a preference to build a
  UI for) to all three `media`/`Media` selections: `trending/queries.ts`, `search/queries.ts`, and
  `anime-detail/queries.ts`. Confirmed against the live API that this argument filters
  server-side (AniList excludes the results entirely, not just a client-side hide) — verified with
  a search term known to surface adult titles, with and without the argument, before and after
  applying it. The detail page's `Media(id, isAdult: false)` means a direct link to an adult
  title now resolves through the existing `notFound()` path, same as slice 3's nonexistent-id
  case.

### Up next

- **Slice 5 — Filters** (genre, format, status, season). Composed into the same URL-state query as
  search; likely a `useSearchParams` + `useRouter`/`Link` pattern for updating the URL without a
  full navigation.
- **Slice 6 — Pagination / infinite scroll.** `useInfiniteQuery`, AniList's `Page(page, perPage)`
  pagination info.
- **Slice 7 — Characters, related media, recommendations** on the detail page. More GraphQL
  fields/operations, nested `Suspense` boundaries so slow sections don't block the whole page.
- **Slice 8 — Loading/error polish.** Route-level `loading.tsx`/`error.tsx`, meaningful skeletons
  instead of generic spinners.
- **Slice 9 (explicitly deferred) — authenticated AniList mutations.** Not started until
  everything above is solid, per the original requirements.

## Comprehension check log

Tracks which concepts have been explained, and whether understanding was confirmed — so we don't
re-explain from zero, but also don't assume mastery we haven't checked.

- Slice 1: GraphQL Codegen `client-preset` flow (why `graphql()` tag vs raw strings, why rerun
  codegen after writing a query). *Explained; not yet confirmed.*
- Slice 2: Server vs Client Component boundary, why TanStack Query on top of RSC fetching,
  per-request `QueryClient` via `React.cache()`, `dehydrate`/`HydrationBoundary`,
  `useSuspenseQuery` + `Suspense` vs. `useQuery` + `isLoading`. *Confirmed via Q&A.* Also covered:
  hooks are hard-illegal in Server Components (no context/state infra, not just "discouraged");
  the `shouldDehydrateQuery` `pending` clause in `get-query-client.ts` exists to support
  streaming SSR if a future slice prefetches without `await` (currently inert since slice 2
  always awaits); client/server `staleTime` must agree or hydrated data refetches immediately on
  mount.
- Slice 3: dynamic route params as a `Promise`; reading back `queryClient.getQueryData()` right
  after an awaited `prefetchQuery` to make a server-side decision (`notFound()`) before any client
  rendering happens; validating URL *shape* at the route boundary vs. *existence* at the data
  boundary, and why (cost + failure-mode reasons, not just tidiness). *Confirmed via Q&A — and
  corrected a real inaccuracy in how slice 3 was originally pitched*: server-side `prefetchQuery`
  always hits AniList on every render (per-request `QueryClient` via `React.cache()` has no
  visibility into the browser's persistent `QueryClient`), so this page does not skip refetches on
  repeat visits. Current real benefit = avoiding the double-fetch (server + redundant client fetch
  on mount), same as slice 2. Cross-navigation cache reuse requires a future client-initiated read
  of the same query key (not yet exercised).
- Slice 4: local input state vs. URL state and why both are needed (not duplication); debouncing
  via a ref-held `setTimeout` in an event handler instead of `useEffect`; `useQuery` +
  `enabled: false` vs. `useSuspenseQuery` for a genuine empty state; deferring a GraphQL fragment
  extraction until a third consumer exists. *Confirmed via Q&A.* Also covered, after an initial gap
  in understanding: why `placeholderData: keepPreviousData` lives at the `useQuery` call site in
  `search-results.tsx` rather than inside the shared `searchAnimeQueryOptions` — shared options
  describe the data's identity (queryKey/queryFn/enabled, true for any consumer), call-site options
  describe one view's presentation choice. Bigger gap, now resolved: `SearchInput` and
  `SearchResults` have no direct connection (no props/callbacks) — they're linked only through the
  URL. Traced the full path: keystroke → local `setValue` → debounced `router.replace` writes
  `?q=` → navigation re-renders both under `/search/page.tsx` → `SearchResults` independently reads
  `useSearchParams().get('q')` → feeds `searchAnimeQueryOptions(query)` → new `queryKey` → TanStack
  Query calls `queryFn` (the actual AniList request) only if that key isn't already cached. Also:
  two mechanisms limit request volume, not just debounce — debounce collapses keystrokes to one
  committed value, and TanStack Query's cache means revisiting an already-fetched value (e.g.
  backspacing back to a prior search) fires no additional request.

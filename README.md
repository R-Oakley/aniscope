# AniScope

A learning project for practicing modern **Next.js App Router**, **React Server/Client
Components**, **TanStack Query v5**, and **GraphQL** patterns against the public
[AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs).

Browse trending anime, search with filters and pagination, view detail pages with
characters / related media / recommendations, sign in with AniList OAuth, and
favorite titles.

> This repo is built as a series of small vertical slices. `docs/plan.md` is the
> living state doc — it records every architectural decision and the reasoning
> behind it, slice by slice. Read that first if you want the full story.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.3.1 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Server state | TanStack Query v5 (prefetch + hydration + streaming) |
| GraphQL transport | `graphql-request` v7 |
| Types | GraphQL Code Generator (`client-preset`) |
| Auth | AniList OAuth (Authorization Code Grant), httpOnly cookie session |
| Tests | Jest + React Testing Library (via `next/jest`) |

## Getting started

### Prerequisites

- Node 20+
- An AniList OAuth application (only needed for the sign-in / favorite features).
  Create one at <https://anilist.co/settings/developer> with redirect URL
  `http://localhost:3000/api/auth/callback`.

### Setup

```bash
npm install
```

Create `.env.local` in the repo root (gitignored):

```bash
ANILIST_CLIENT_ID=your_client_id
ANILIST_CLIENT_SECRET=your_client_secret
```

The redirect URI is hardcoded to `http://localhost:3000/api/auth/callback` in
`src/lib/auth/config.ts`. Trending / search / detail pages work without any of
this — AniList's read API needs no auth.

### Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run codegen` | Regenerate GraphQL types — **run after editing any query** |

## Architecture

Feature-based organization. `src/app/` is routing-only; everything else lives
under `src/features/<feature>/` or `src/lib/`.

```
src/
  app/                     Routes only (pages, layouts, loading/error/not-found, route handlers)
    (home)/                Route group — scopes the homepage loading.tsx without affecting the URL
    anime/[id]/            Detail route
    api/auth/{login,callback,logout}/   OAuth route handlers
    search/
  features/
    trending/              Trending list  (server prefetch + client useSuspenseQuery)
    search/                Search input, filters, paginated results  (client-driven, URL state)
    anime-detail/          Detail hero + characters / relations / recommendations + favorite
    auth/                  Viewer query, nav auth status
  components/
    anime-card.tsx         Shared presentational card (trending, search, recommendations, relations)
  lib/
    anilist/               GraphQL client + generated types (committed)
    auth/                   server-only session + OAuth config
    query/                 Per-request server QueryClient, browser Providers, shared staleTime
```

### Key patterns

- **Server Components by default.** `"use client"` only for interactivity, browser
  APIs, or React client hooks.
- **TanStack Query owns all remote data.** Never copied into `useState`.
  - `src/lib/query/get-query-client.ts` — a per-request `QueryClient` built with
    `React.cache()`, used only in Server Components.
  - `src/lib/query/providers.tsx` — the browser `QueryClientProvider`, mounted
    once in the root layout.
  - Per feature: a `query-options.ts` (`queryOptions()` / `infiniteQueryOptions()`)
    is the single definition of `queryKey` + `queryFn`, shared between the server's
    `prefetchQuery` and the client's `useSuspenseQuery` / `useInfiniteQuery`.
  - Per feature: a **Server "section"** component prefetches and renders
    `<HydrationBoundary><Suspense><ClientPart /></Suspense></HydrationBoundary>`.
    Un-awaited prefetches stream in per-section (the `pending` clause in
    `shouldDehydrateQuery` enables this).
- **URL search params** hold anything shareable/server-readable: search text,
  filters, pagination is owned internally by `useInfiniteQuery`.
- **No `useEffect` for data fetching**, ever. Debouncing is done in an event
  handler with a ref-held `setTimeout`, not an effect.
- **GraphQL:** operations written inline with the generated `graphql()` tag in
  `queries.ts` files. Generated output in `src/lib/anilist/generated/` is
  committed so the project type-checks without a network call. `isAdult: false`
  is hardcoded on every media selection.
- **Auth:** access token stored in an **httpOnly cookie** (never readable by
  client JS). Mutations go through a Server Action so the server can attach
  `Authorization: Bearer`. `src/lib/auth/*` imports `server-only` to fail the
  build on accidental client import.

## Testing

Jest + RTL, configured through `next/jest`. **Jest cannot render `async` Server
Components** (a fundamental limitation, not config) — so tests cover plain
functions (`*QueryOptions`, `getNextPageParam`, HTML-stripping), synchronous
Client Components, and client logic like the search debounce and optimistic
favorite toggle. Tests are colocated as `*.test.ts(x)` next to the file under
test.

## Features

| Slice | Feature |
| --- | --- |
| 1–2 | Trending anime — GraphQL/codegen pipeline, then server prefetch + hydration |
| 3 | Anime detail page (`/anime/[id]`) |
| 4 | Search — client-driven, debounced, URL `?q=` state |
| 5 | Filters — genre / format / status / season (single-select, in search params) |
| 6 | Pagination — `useInfiniteQuery` with a "Load more" button |
| 7 | Characters, related media, recommendations — independent streaming Suspense sections |
| 8 | `loading.tsx` / `error.tsx` / `not-found.tsx` polish |
| 9 | AniList OAuth sign-in + first real mutation (`ToggleFavourite` via a Server Action) |

See `docs/plan.md` for the full slice-by-slice record, including deferred
follow-ups.

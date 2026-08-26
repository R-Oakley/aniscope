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

## Testing

Jest + React Testing Library, set up via `next/jest` (auto-configures the Next.js compiler
transform, CSS/font/image mocking, module aliases). `jest.config.ts` + `jest.setup.ts` at the
repo root; `npm test` / `npm run test:watch`.

**Hard constraint (from Next's own docs, `node_modules/next/dist/docs/01-app/02-guides/testing/jest.md`):
Jest cannot render/unit-test `async` Server Components at all** — not a config limitation, a
fundamental one (Jest has no way to await a component mid-render). Since every Server Component in
this app is `async` (`TrendingAnimeSection`, `AnimeDetailSection`, both `page.tsx` files), none of
that prefetch/hydrate/`notFound()` logic is Jest-testable. Coverage there would require E2E tooling
(Playwright — discussed, not yet installed) as a separate future decision, not something to force
into Jest. What Jest *can* cover: plain functions (`*QueryOptions`), synchronous Client Components,
and non-trivial client-side logic (debouncing, event handlers).

**Sequencing decision**: rather than a full mechanical backfill of tests across slices 1-4 (most of
those Server-section/Client-list pairs are structurally identical — low teaching value repeated
four times), set up Jest and wrote a small, deliberately representative set of tests against
existing code to establish the whole toolkit, then write tests alongside new code from slice 5
onward as standard practice rather than a separate catch-up phase.

**Representative tests written (colocated as `*.test.ts(x)` next to the file under test, matching
this project's feature-folder colocation preference)**:
- `src/features/search/query-options.test.ts` — plain function test, no rendering. Covers the
  `enabled`-on-empty-string and trim-for-cache-key logic.
- `src/components/anime-card.test.tsx` — sync Client Component, `render`/`screen` from RTL. Covers
  title fallback chain (english → romaji → "Untitled"), link href, conditional cover image.
- `src/features/search/search-input.test.tsx` — the centerpiece: mocks `next/navigation`'s
  `useRouter`/`usePathname`/`useSearchParams` (the component can't run its real hooks outside an
  actual Next.js router), uses `jest.useFakeTimers()` + `userEvent.setup({ delay: null })` to test
  the debounce deterministically without real waiting. **Caught a real bug**: clearing the input
  produced a URL of `/search?` (dangling `?`) instead of `/search` — fixed in `search-input.tsx`
  to omit the `?` when the query string is empty, not just adjusted the test to match.

*Comprehension confirmed via Q&A*: why `next/navigation` needs mocking (its hooks throw outside a
router context) vs. `next/link` not needing it (degrades gracefully instead of throwing — a
nuance added on top of a mostly-correct initial answer); what actually happens if
`jest.advanceTimersByTime` is called without `jest.useFakeTimers()` first — verified empirically
by temporarily removing it and reading the real error, rather than answering from memory (Jest
throws "timers APIs are not replaced with fake timers," it does not silently no-op or roll real
time forward).

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

- **Slice 5 — Filters** (genre, format, status, season) on the `/search` page. Single-select
  dropdowns, not multi-select — deliberate scoping, multi-select genre needs real URL-array
  encoding that isn't needed yet. Genre list hardcoded against AniList's live `GenreCollection`
  (verified via curl), `Hentai` excluded consistent with the `isAdult: false` fix; format list
  restricted to anime-relevant `MediaFormat` values only (excludes manga-only enum values that
  would just return zero results against `type: ANIME`). **Real bug caught before it shipped**:
  verified directly against the live API that AniList treats `search: ""` (explicit empty string)
  as "match nothing," not "no search filter" — different from omitting the argument. Slice 4 never
  hit this because `enabled` guaranteed real text was always present; slice 5's filter-only
  browsing (pick a genre, type nothing) would have silently returned zero results without fixing
  `searchAnimeQueryOptions` to send `undefined` (not the trimmed empty string) when there's no
  text — caught by testing against the real API before writing the fix, not discovered later via
  a broken UI. Also required an explicit `sort: POPULARITY_DESC` on the query — filter-only
  queries with no sort returned empty results in testing, sorted ones didn't.
  `FilterBar` needs no debounce and no local `useState` at all (unlike `SearchInput`) — a
  `<select>` firing is one discrete event, not a keystroke stream, so each dropdown just reads
  straight from `searchParams.get(...)`. Added `src/features/search/filter-bar.tsx` (with a small
  internal `FilterSelect` sub-component — genuine 4x same-file duplication, not premature
  abstraction), updated `query-options.ts` (`SearchFilters` type derived from the generated
  `SearchAnimeQueryVariables` rather than redeclared) and `search-results.tsx` to read/pass
  filters, updated `search/queries.ts` with the new optional GraphQL variables.
  **Tests written alongside the code** (per the sequencing decision in Testing, above — first
  slice where this was standard practice rather than a separate pass): `query-options.test.ts`
  gained a regression test for the empty-string landmine (mocks `anilistClient.request`, asserts
  the actual variables sent) and an `enabled`-via-filter-only test; `filter-bar.test.tsx` covers
  writing/clearing a param and preserving other active filters when changing one — no fake timers
  needed, unlike `search-input.test.tsx`. **Also fixed a gap in the Jest setup itself**: `next/jest`
  does not pick up the `@/*` path alias from `tsconfig.json` automatically (a manual
  `moduleNameMapper` step per Next's own docs, easy to miss since every test until now used
  relative imports or bare package names) — added to `jest.config.ts`.

- **Slice 6 — Pagination on `/search` results only** (trending stays a fixed top-10 — "trending" is
  inherently a bounded top-N snapshot, deliberately not made infinite). Converted
  `searchAnimeQueryOptions` from `queryOptions` to `infiniteQueryOptions`; `SearchResults` swapped
  `useQuery` for `useInfiniteQuery`. Chose a **"Load more" button** over true scroll-triggered
  auto-loading (user's call, presented as a genuine fork) — keeps this slice focused purely on
  `useInfiniteQuery` mechanics with no new browser APIs or `useEffect` involved; true infinite
  scroll (`IntersectionObserver` + `useEffect` as a legitimate, correct use of an effect — a good
  future contrast to slice 4's deliberate *avoidance* of `useEffect` for the debounce) is a natural
  later enhancement, not done here. Page number is **not** URL state (unlike `q`/filters) and not
  component state either — `useInfiniteQuery` owns it internally via `data.pages`; deliberately
  not bookmarkable, since nobody bookmarks "page 3 of these results." Added `$page: Int` and
  `pageInfo { hasNextPage }` to the `SearchAnime` query; `getNextPageParam` uses the third
  argument (`lastPageParam`) rather than reading a `currentPage` back out of the response —
  simpler, one fewer field to select. Verified against the live API that page 1 and page 2 return
  genuinely different, non-overlapping results and `hasNextPage` reports correctly. Tests added:
  `getNextPageParam` returns `lastPageParam + 1` when more pages exist, `undefined` when
  `hasNextPage` is false.

- **Slice 7 — Characters, related media, recommendations** on the detail page. Three separate
  GraphQL operations (`AnimeCharacters`, `AnimeRelations`, `AnimeRecommendations`), not fields
  bolted onto the existing `AnimeDetail` query — GraphQL resolves one request atomically (no
  partial response, AniList doesn't support `@defer`/`@stream`), so separate operations were
  required to get independent `queryKey`s and therefore independent `Suspense` boundaries at all,
  not just a style preference. **First real use of the `pending`-status `shouldDehydrateQuery`
  clause added back in slice 2** (previously inert): the core detail query stays `await`ed as
  before (needed for the `notFound()` decision), but characters/relations/recommendations are
  `queryClient.prefetchQuery(...)` **without** `await`, each wrapped in its own `<Suspense>` — the
  pending clause is what lets a still-resolving query ride along in the hydration payload and
  stream into the response per-section, instead of the client needing a fresh fetch from scratch
  after mount. **Precise correction to the initial pitch**: the three background queries don't all
  start at function entry — they're kicked off only *after* the core query's `await` resolves
  (sequential relative to the core fetch), then run concurrently *with each other* (not
  sequentially relative to one another). The benefit isn't "all four requests race from t=0," it's
  that the function's `return` doesn't block on the three finishing. `relations`/`recommendations`
  both return full `Media` nodes shaped exactly like `AnimeCardData` — reused `<AnimeCard>`
  directly, no new markup, validating the slice-4 decision to type it against a generic structural
  interface rather than one specific generated query type. **Deliberately still not** extracting
  the shared GraphQL fragment flagged back in slice 4, even though recommendations is now a third
  (relations a fourth) consumer of the same field selection — fragment masking (the generated
  `useFragment` helper, unused since slice 1) is a genuinely new concept, and bundling it into an
  already-dense slice (parallel streaming + three new query shapes) would be too much new material
  at once. Flagged as a clean, well-motivated follow-up. **Known accepted gap**: a failed
  background prefetch doesn't get dehydrated (TanStack's default `shouldDehydrateQuery` doesn't
  serialize error states, only success + our added pending case), so the client would retry fresh
  after mount, and if that also fails, `useSuspenseQuery` throws with no error boundary yet to
  catch it (still slice 8). Added `.catch(() => {})` on the three un-awaited prefetches purely to
  stop Node's unhandled-rejection warning — explicitly not real error handling. Added
  `characters-list.tsx`, `related-media-list.tsx` (exports `formatRelationType`, tested), and
  `recommendations-list.tsx`, all client, all `useSuspenseQuery`. Verified against the live API
  (One Piece, id 21) — real characters, related media, and recommendations render with real AniList
  data, no errors.

- **Out-of-band fix — raw HTML leaking through anime descriptions.** User caught this by actually
  using the app (One Piece's description showed literal `<br><br>` and `<b>` text). Root cause:
  slice 3's `description(asHtml: false)` choice was based on a wrong assumption —
  `asHtml: false` does **not** strip HTML, it returns AniList's raw stored text as-is, and editors
  frequently type literal HTML tags directly into that raw text. Verified against the live API
  (One Piece, id 21) comparing `asHtml: false` vs `asHtml: true` output before writing any fix, to
  see exactly what AniList actually returns rather than guessing. Considered switching to
  `asHtml: true` + `dangerouslySetInnerHTML` (would render properly formatted paragraphs/lists),
  but rejected it: that means trusting third-party API content as safe HTML, which is a real XSS
  surface without a sanitization library in front of it — and pulling in a sanitizer felt like too
  much weight for a description blurb. Instead added `stripDescriptionHtml` (exported from
  `anime-detail.tsx`, tested against real One Piece description text) — converts `<br>` variants
  to real newlines (rendered via the `whitespace-pre-line` already in place), strips every other
  tag, and is safe by construction regardless of what's stripped: the result is still rendered as
  a plain React string child, and React always escapes string children, so nothing in the
  (possibly imperfectly stripped) output can ever be interpreted as markup. Verified fixed against
  the live running page, not just the unit tests.

- **Slice 8 — Loading/error polish.** All three special files (`loading.tsx`, `error.tsx`,
  `not-found.tsx`) follow the exact same folder-nesting rule as `layout.tsx`. Checked the docs
  first and found a real version-specific trap: this Next version's `error.tsx` takes a `retry`
  prop, not the `reset` prop shown in older Next docs/tutorials. Reused the skeleton components
  already built inside `trending-anime-section.tsx`/`anime-detail-section.tsx` (exported them)
  for the route-level `loading.tsx` fallbacks rather than inventing new markup. One `error.tsx`
  per route (not one generic catch-all) for tailored copy, closing several "known gap" items
  logged earlier (slice 5's invalid-filter-enum case, slice 7's failed-background-prefetch case).
  Distinguished `error.tsx` (unexpected thrown errors) from `not-found.tsx` (the deliberate
  `notFound()` signal we've called since slice 3, previously falling back to Next's unstyled
  default) — added both a root `not-found.tsx` and a more specific `anime/[id]/not-found.tsx`
  (same nesting/override rule again). Did **not** add `global-error.tsx` — that's specifically for
  root *layout* failures, and our root layout does zero data fetching, genuinely low-risk.

  **A real mistake, caught by re-verifying rather than assuming the fix worked**: adding
  `loading.tsx` at `/anime/[id]` silently broke something slice 3 explicitly verified — nonexistent
  and malformed anime ids started returning HTTP `200` instead of `404`. Root cause (confirmed via
  the docs' "Status Codes" section): a `loading.tsx`'s Suspense fallback starts streaming the
  response immediately, which commits the status code before `notFound()` (which runs later, after
  `await params` and the prefetch) ever gets a chance to influence it — documented, expected Next
  behavior (streamed not-found responses get `200` + an auto-injected `noindex` meta tag, not a
  true `404`). Presented the tradeoff to the user rather than deciding unilaterally: drop the
  loading skeleton for this route to preserve the verified-correct 404, or keep it and accept
  `200`+`noindex`. Chose to drop it — **but my first attempt (deleting only
  `anime/[id]/loading.tsx`) did not fix it**, and re-running the exact same curl checks (not
  assuming the deletion worked) proved that immediately: still `200`. Root cause of *that*: a
  `loading.tsx` cascades to every descendant route the same way a `layout.tsx` does — the *root*
  `src/app/loading.tsx` (added for the homepage) was still wrapping `/anime/[id]` in a Suspense
  boundary, since that route had no more-specific `loading.tsx` of its own to override it. This is
  the exact nesting rule already documented above for `layout.tsx` — just applied incorrectly on
  the first pass, and only caught because the fix was re-verified against the live server instead
  of trusted on sight. Real fix: moved the homepage's `page.tsx` and `loading.tsx` into a
  `src/app/(home)/` **route group** — route groups don't affect the URL (`/` still resolves the
  same), but they do properly scope a `loading.tsx`'s cascading Suspense boundary to only the
  routes inside that group, so `/anime/[id]` and `/search` are no longer affected by it.
  `/search/loading.tsx` was never actually part of this problem (it's correctly scoped to its own
  segment, and `/search` has no `notFound()` call to conflict with streaming anyway). Re-verified
  every route after the route-group fix: homepage 200 with skeleton path intact, nonexistent/
  malformed anime ids both back to 404, valid anime page 200, search 200, unmatched route 404 via
  root `not-found.tsx`. Added `src/app/error.test.tsx` (retry button behavior) as the one
  representative test for this slice — the rest are static skeleton/copy, low value to test
  exhaustively.

- **Slice 9a — AniList OAuth sign-in (mutations themselves not started yet).** Slice 9 is too big
  for one pass — broken into 9a (sign-in only), 9b (deferred), 9c (deferred, an actual mutation via
  `useMutation`). User registered a real AniList OAuth application
  (`anilist.co/settings/developer`) — Client ID `49518`, secret in `.env.local`
  (`ANILIST_CLIENT_ID`/`ANILIST_CLIENT_SECRET`, gitignored). Verified AniList's actual OAuth docs
  before writing anything (`anilist.gitbook.io/anilist-apiv2-docs`) rather than relying on
  memory: Authorization Code Grant chosen deliberately over Implicit Grant (keeps the client
  secret server-side); `grant_type=authorization_code` required; authenticated requests use
  `Authorization: Bearer {token}`; access tokens are long-lived (~1 year) and AniList does **not**
  support refresh tokens, which simplifies the design — no rotation logic needed, the session
  cookie's `maxAge` just matches the token's lifetime. Also verified this Next version's `cookies()`
  (async, `set`/`delete` only work in Server Functions or Route Handlers, not plain Server
  Components) and `route.ts` conventions before writing any code, given two prior surprises this
  project already hit from assuming instead of checking (the `retry` prop, the loading.tsx/404
  interaction).

  First use of **Route Handlers** in this app: `src/app/api/auth/login/route.ts` (redirects to
  AniList's authorize URL, sets a random CSRF `state` cookie first), `callback/route.ts` (verifies
  `state`, exchanges the code for a token server-side via `fetch`, sets an httpOnly access-token
  cookie), `logout/route.ts` (clears it). The access token lives in an **httpOnly** cookie
  deliberately — not TanStack Query, not React state — specifically so client-side JS can never
  read it at all (XSS protection), unlike TanStack Query's cache which is plainly inspectable in
  devtools. `src/lib/auth/session.ts` and `config.ts` both import the `server-only` package (a new
  dependency, installed for this) so any accidental import of session/secret-handling code into a
  Client Component fails at build time rather than relying on Next's own runtime guards alone.
  Added `src/features/auth/get-viewer.ts` — the first *authenticated* GraphQL request in this app,
  using `graphql-request`'s per-call `requestHeaders` third argument (verified its exact signature
  against the installed v7 type definitions rather than assuming) rather than a second client
  instance, since the token is per-user the same way a server `QueryClient` can't be a module-level
  singleton. `src/features/auth/nav-auth.tsx` is an async Server Component wrapped in its own
  `<Suspense>` in the root layout, so checking auth status doesn't block every page's render — same
  discipline as slices 7/8. Sign-in/sign-out are plain `<a href="/api/...">` links, not `next/link`
  — deliberate, since they navigate to Route Handlers that redirect, not to in-app routes, so
  client-side prefetching/transitions don't apply.

  **Verified as far as possible without a real browser OAuth flow** (curl can't click "Approve" on
  AniList's own consent screen — this is the first slice where I can't verify the full path myself):
  homepage renders "Sign in with AniList" with no cookie present; `/api/auth/login` redirects
  (307) to exactly the right AniList URL with the correct `client_id`, URL-encoded `redirect_uri`,
  `response_type=code`, and a random `state`; every other route still works unaffected. **Confirmed
  by the user in a real browser**: signed in successfully (nav showed "Signed in as Yelkao85"),
  sign-out also worked. Slice 9a is done.

- **Slice 9c — first real mutation (`ToggleFavourite`).** 9b (broader auth-state exposure) turned
  out unnecessary as its own slice — folded directly into 9c instead, small enough to not warrant
  a separate pass. **Direct architectural consequence of 9a's httpOnly cookie choice**: a Client
  Component cannot read the access token at all (that's the whole point of httpOnly), so it cannot
  attach `Authorization: Bearer` itself — the mutation has to go through *our own server*, which
  can read the cookie. First use of a **Server Action** (`src/features/anime-detail/actions.ts`,
  `'use server'`) — different from 9a's Route Handlers (built for full-page redirect flows);
  a Server Action is for a client component invoking server logic directly, called straight from
  `useMutation`'s `mutationFn`. First use of `useMutation` in the project at all — everything
  through slice 8 was read-only (`useQuery`/`useSuspenseQuery`/`useInfiniteQuery`).
  Verified `ToggleFavourite(animeId: Int)` and `Media.isFavourite: Boolean!` against the live
  schema before writing the queries, same discipline as always. **Deliberately did not route the
  initial `isFavourite` read through TanStack Query prefetch/hydration** like every other section
  on this page — it becomes a one-time prop to `FavoriteButton`, never read via `useQuery` on the
  client, so there's no client cache entry for it to populate; a plain `await` in
  `favorite-section.tsx` is simpler and sufficient. This is the same "not everything server-fetched
  needs TanStack Query" principle from slice 1, sharpened here by the value being viewer-specific
  and non-shareable anyway. Optimistic update in `favorite-button.tsx` uses local `useState`
  toggled in `onMutate`/rolled back in `onError` — not `queryClient.setQueryData`, since (per the
  above) there's no query cache entry backing this value to update. Signed-out state shows a
  disabled "Sign in to favorite" button rather than hiding the feature entirely.
  **Tests**: `favorite-button.test.tsx` mocks the Server Action (not the hook) and covers the
  signed-out disabled state, the optimistic flip on click, and rollback on failure — the rollback
  test needed simplifying after a real flake: an instantly-rejecting mock collapsed the
  optimistic-then-rollback sequence before the intermediate frame was observable, so that test
  asserts the stable end state (reverted) rather than the fleeting intermediate one.
  **Verified myself**: signed-out state renders the disabled prompt correctly on the live page, no
  regressions elsewhere. **Confirmed by the user in a real browser**: the button sets, unsets, and
  persists correctly across a refresh. Slice 9c is done.

## Status: all originally-scoped slices (1 through 9) are complete

Everything in the original plan is built, tested, and verified against the live API. What's left
is a set of explicitly-deferred follow-ups logged along the way — see "Known deferred follow-ups"
below — none blocking, all optional.

### Up next

Nothing currently planned. See "Known deferred follow-ups" for a menu of optional next steps if
picking this back up.

## Known deferred follow-ups

Things explicitly flagged as "not now" during earlier slices, kept here as a single list rather
than scattered through the Done section above:

- **GraphQL fragment extraction** (flagged in slice 4, re-flagged in slice 7 once a 3rd/4th
  consumer existed) — `AnimeCardData`'s field selection is currently kept in sync by hand across
  `trending`, `search`, `relations`, and `recommendations` queries. A shared fragment (using the
  generated `useFragment` masking helper, unused since slice 1) would make that guarantee
  automatic instead of disciplined.
- **Filter value validation** (slice 5) — `search-results.tsx`'s `as SearchFilters["format"]`
  casts are type assertions, not runtime validation. A hand-edited URL like `/search?format=banana`
  reaches AniList as an invalid enum and returns a GraphQL error with no graceful handling.
- **Multi-select genre / live `GenreCollection` fetch** (slice 5) — genre filter is single-select
  and the option list is hardcoded rather than fetched from AniList.
- **True infinite scroll** (slice 6) — currently a "Load more" button; `IntersectionObserver` +
  `useEffect` auto-loading was the alternative, deliberately not built.
- **`global-error.tsx`** (slice 8) — root layout failures aren't caught by any error boundary
  (only `page.tsx` and below are). Skipped because the root layout does zero data fetching,
  genuinely low risk right now.
- **Token expiry handling** (slice 9a) — AniList tokens last ~1 year with no refresh mechanism;
  there's no UI yet for "your session expired, please sign in again" — an expired token just
  silently falls back to the signed-out state.

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
- Slice 5: why `FilterBar` needs neither debounce nor local `useState` (a `<select>` firing is one
  discrete event, not a keystroke stream — contrast with `SearchInput`); folding multiple filter
  values into one `queryKey` so distinct filter combinations cache separately; deriving
  `SearchFilters` from the generated `SearchAnimeQueryVariables` type instead of redeclaring it;
  verifying API-specific behavior (empty-string search, missing-sort-on-filter-only-queries)
  against the live API before writing code around it, rather than assuming. *Explained in depth at
  user's request rather than guessed through.* **Known current gap surfaced during this
  explanation, not yet fixed**: the `as SearchFilters["format"]` (etc.) casts in
  `search-results.tsx` are type assertions, not runtime validation — safe for every path through
  our own `FilterBar` UI (which only ever writes its own known-good option values), but a
  hand-edited URL like `/search?format=banana` would flow straight through to AniList as an
  invalid enum value and come back as a GraphQL error we don't currently handle (no `error.tsx`
  yet — slice 8). Contrast with slice 3's `Number.isInteger` check, which *was* real validation at
  a trust boundary. Follow-up: validate filter values against the known `FORMATS`/`STATUSES`/
  `SEASONS` lists and drop invalid ones instead of trusting the cast.
- Slice 6: why page number lives in neither the URL nor component state, but inside
  `useInfiniteQuery` itself; `getNextPageParam`'s three-argument shape and why using
  `lastPageParam` is simpler than selecting `currentPage` back out of the response; why the
  `queryKey` deliberately excludes the page number (distinguishes *searches*, not *pages of a
  search*) — contrast with slice 5's key, which deliberately *does* include every filter.
  *Confirmed via Q&A, with depth added on two points*: `getNextPageParam` is called automatically
  by TanStack after every page resolves (including the first), not computed on-demand when
  `fetchNextPage` is clicked — the next page number is already sitting there precomputed by click
  time. And changing a filter doesn't "reset to page 1" via any pagination-aware code — it produces
  a different `queryKey`, which `useInfiniteQuery` treats as a brand new query with no `data.pages`
  yet, so it starts from `initialPageParam` for the first time; the *old* query (mid-scroll) stays
  cached untouched, and `keepPreviousData` is what makes the visual transition dim rather than
  flash empty.
- Slice 7: why three separate GraphQL operations were structurally necessary (not stylistic) to
  get independent `Suspense` boundaries — GraphQL has no partial-response mechanism here; why the
  core detail query stays `await`ed while the other three don't (the `notFound()` decision depends
  on it); the payoff of slice 2's previously-inert `pending` dehydration clause; the precise
  (corrected) sequencing of the three background prefetches — after the core query, concurrent with
  each other, not racing from function entry. *Explained in depth at user's request rather than
  guessed through*: (1) why one combined query couldn't give independent streaming — GraphQL has
  no partial-response mechanism, and one operation = one queryKey = one all-or-nothing Suspense
  boundary; (2) the precise difference between the awaited core `prefetchQuery` and the un-awaited
  `.catch(() => {})` ones — `await` gives natural error propagation, the un-awaited calls have
  nothing observing them so `.catch()` exists purely to stop Node's unhandled-rejection warning,
  not as real error handling (that gap has since been closed by slice 8's `error.tsx`); (3) why
  `AnimeCard` needed zero changes for two query shapes it predates — hand-authored structural
  interface with every field optional, plus deliberately mirroring the same field selection across
  queries by discipline (the exact risk the still-deferred GraphQL fragment extraction would
  remove).
- Slice 8: `loading.tsx`/`error.tsx`/`not-found.tsx` nest exactly like `layout.tsx` (direct
  continuation of the layout-nesting question from the prior conversation turn); `error.tsx` vs
  `not-found.tsx` are for genuinely different situations (unexpected throws vs. deliberate
  `notFound()`); this Next version's `error.tsx` prop is `retry`, not the `reset` shown in older
  docs. The real content here wasn't explained so much as *lived through*: a `loading.tsx`'s
  Suspense fallback commits the response status code before a later `notFound()` call can influence
  it (streamed not-found = `200`+`noindex`, not a true `404`) — and fixing it by deleting only the
  nested `loading.tsx` looked done but wasn't, because the *root* `loading.tsx` cascades to
  descendant routes the same way a layout does. Caught only because the fix was re-verified against
  the live server rather than trusted on sight. Route groups (`(home)/`) are what actually scope a
  loading/layout boundary to a subset of routes without affecting the URL. *No explicit Q&A this
  time — narrated in detail in the Done section above instead, given how much of it was the
  debugging process itself rather than a settled explanation.*

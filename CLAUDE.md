@AGENTS.md

# AniScope

Learning project for practicing modern Next.js, React, TanStack Query
and GraphQL patterns.

## Stack

- Next.js App Router
- React
- TypeScript strict mode
- TanStack Query v5
- graphql-request
- GraphQL Code Generator
- AniList GraphQL API
- Tailwind CSS

## Architecture

Use feature-based organization under src/features.

GraphQL transport belongs in feature api modules.

TanStack Query owns remote server state.

React local state should only be used for actual UI state.

Prefer Server Components. Add "use client" only when browser APIs,
React client hooks or interactivity require it.

Do not fetch remote server data with useEffect.

Keep GraphQL operations in .graphql files.

Generate GraphQL result/variable types rather than manually duplicating
API response interfaces.

Query key factories should live beside the feature API.

URL-addressable filters belong in search params rather than duplicated
React state.

## React rules

Avoid:

- useEffect for derived state
- syncing state unnecessarily
- unnecessary useMemo/useCallback
- giant components
- prop drilling where composition solves the problem
- fetching inside useEffect
- premature abstractions
- storing server state in Zustand/Context
- unnecessary client components

## Workflow

Before implementing significant changes:

1. Explain the approach.
2. Identify Server vs Client Component boundaries.
3. Identify where state should live.
4. Identify the GraphQL operation required.
5. Identify the TanStack query key.
6. Implement the smallest vertical slice.
7. Run typecheck, lint and tests.
8. Review the diff.

Do not implement an entire feature without explaining important
Next.js, React, TanStack Query or GraphQL decisions to me.

This is a learning project. Prefer teaching me why over silently
making architectural decisions.

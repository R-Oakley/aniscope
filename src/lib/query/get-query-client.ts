import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { cache } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data was just fetched on the server; avoid an immediate client refetch.
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

// `cache()` scopes this to a single request, so every Server Component
// rendering the same request shares one QueryClient instead of each
// creating its own (which would prefetch the same query multiple times).
export const getQueryClient = cache(makeQueryClient);

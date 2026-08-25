"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { animeCharactersQueryOptions } from "./query-options";

export function CharactersList({ id }: { id: number }) {
  const { data } = useSuspenseQuery(animeCharactersQueryOptions(id));
  const edges = data.Media?.characters?.edges ?? [];

  if (edges.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Characters</h2>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {edges.map(
          (edge) =>
            edge?.node && (
              <li key={edge.node.id} className="flex flex-col gap-2">
                {edge.node.image?.medium && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={edge.node.image.medium}
                    alt={edge.node.name?.full ?? ""}
                    className="aspect-2/3 w-full rounded object-cover"
                  />
                )}
                <div className="text-sm">
                  <p className="font-medium leading-tight">{edge.node.name?.full}</p>
                  <p className="text-xs text-zinc-500">{edge.role}</p>
                </div>
              </li>
            ),
        )}
      </ul>
    </section>
  );
}

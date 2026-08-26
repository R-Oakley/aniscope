"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { toggleFavouriteAnime } from "./actions";

export function FavoriteButton({
  animeId,
  initialIsFavourite,
  signedIn,
}: {
  animeId: number;
  initialIsFavourite: boolean;
  signedIn: boolean;
}) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);

  // No client-side query backs this value (it arrives once as a server
  // prop, not via useQuery), so there's no query cache entry to
  // optimistically update — local state toggled in onMutate/rolled back in
  // onError is the right tool here instead.
  const mutation = useMutation({
    mutationFn: () => toggleFavouriteAnime(animeId),
    onMutate: () => {
      const previous = isFavourite;
      setIsFavourite((current) => !current);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context) setIsFavourite(context.previous);
    },
  });

  if (!signedIn) {
    return (
      <button
        disabled
        title="Sign in to favorite"
        className="w-fit rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-700"
      >
        ♡ Sign in to favorite
      </button>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="w-fit rounded border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50 dark:border-zinc-700"
    >
      {isFavourite ? "♥ Favorited" : "♡ Favorite"}
    </button>
  );
}

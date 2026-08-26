import { getViewer } from "@/features/auth/get-viewer";
import { anilistClient } from "@/lib/anilist/client";
import { getAccessToken } from "@/lib/auth/session";

import { FavoriteButton } from "./favorite-button";
import { mediaFavouriteStatusQuery } from "./queries";

// Not routed through TanStack Query prefetch/hydration like the other
// sections on this page — the result becomes a one-time prop to
// FavoriteButton, not something a client component reads via useQuery, so
// there's no client cache entry for it to populate. A plain await is
// simpler and entirely sufficient here.
export async function FavoriteSection({ id }: { id: number }) {
  const viewer = await getViewer();

  if (!viewer) {
    return (
      <FavoriteButton animeId={id} initialIsFavourite={false} signedIn={false} />
    );
  }

  const token = await getAccessToken();
  const data = await anilistClient.request(
    mediaFavouriteStatusQuery,
    { id },
    { Authorization: `Bearer ${token}` },
  );

  return (
    <FavoriteButton
      animeId={id}
      initialIsFavourite={data.Media?.isFavourite ?? false}
      signedIn
    />
  );
}

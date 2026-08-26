"use server";

import { anilistClient } from "@/lib/anilist/client";
import { getAccessToken } from "@/lib/auth/session";

import { toggleFavouriteAnimeMutation } from "./queries";

// Called directly from the client as useMutation's mutationFn. The client
// never sees the access token — it lives in an httpOnly cookie, readable
// only here, on the server, which is the whole reason this needs to be a
// Server Action rather than a request the browser makes itself.
export async function toggleFavouriteAnime(animeId: number) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not signed in");
  }

  await anilistClient.request(
    toggleFavouriteAnimeMutation,
    { animeId },
    { Authorization: `Bearer ${token}` },
  );
}

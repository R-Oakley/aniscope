import "server-only";

import { anilistClient } from "@/lib/anilist/client";
import { getAccessToken } from "@/lib/auth/session";

import { viewerQuery } from "./queries";

export async function getViewer() {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const data = await anilistClient.request(
      viewerQuery,
      {},
      { Authorization: `Bearer ${token}` },
    );
    return data.Viewer ?? null;
  } catch {
    // Covers an expired or otherwise invalid token — treated the same as
    // not being signed in, rather than surfacing an error for this case.
    return null;
  }
}

import { NextResponse } from "next/server";

import {
  ANILIST_AUTHORIZE_URL,
  ANILIST_CLIENT_ID,
  ANILIST_REDIRECT_URI,
} from "@/lib/auth/config";
import { setOAuthStateCookie } from "@/lib/auth/session";

export async function GET() {
  if (!ANILIST_CLIENT_ID) {
    return NextResponse.json(
      { error: "ANILIST_CLIENT_ID is not configured" },
      { status: 500 },
    );
  }

  // Random per-attempt value, stored server-side and checked again in the
  // callback — protects against CSRF (an attacker tricking a signed-in
  // user's browser into completing an OAuth flow the user never started).
  const state = crypto.randomUUID();
  await setOAuthStateCookie(state);

  const authorizeUrl = new URL(ANILIST_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", ANILIST_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", ANILIST_REDIRECT_URI);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl);
}

import { NextResponse, type NextRequest } from "next/server";

import {
  ANILIST_CLIENT_ID,
  ANILIST_CLIENT_SECRET,
  ANILIST_REDIRECT_URI,
  ANILIST_TOKEN_URL,
} from "@/lib/auth/config";
import { consumeOAuthStateCookie, setAccessTokenCookie } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = await consumeOAuthStateCookie();

  // Covers both a missing/tampered state and the user denying access on
  // AniList's consent screen (no code at all in that case).
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/?auth_error=1", request.url));
  }

  if (!ANILIST_CLIENT_ID || !ANILIST_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "AniList OAuth credentials are not configured" },
      { status: 500 },
    );
  }

  const tokenResponse = await fetch(ANILIST_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: ANILIST_CLIENT_ID,
      client_secret: ANILIST_CLIENT_SECRET,
      redirect_uri: ANILIST_REDIRECT_URI,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/?auth_error=1", request.url));
  }

  const { access_token: accessToken } = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!accessToken) {
    return NextResponse.redirect(new URL("/?auth_error=1", request.url));
  }

  await setAccessTokenCookie(accessToken);

  return NextResponse.redirect(new URL("/", request.url));
}

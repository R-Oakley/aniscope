import "server-only";
import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "anilist_access_token";
const OAUTH_STATE_COOKIE = "anilist_oauth_state";

// AniList access tokens are valid for ~1 year and AniList does not support
// refresh tokens (verified against their docs) — the cookie's lifetime just
// matches the token's, since there's no rotation to design around.
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 365;
// Just long enough to complete the redirect round trip to AniList and back.
const OAUTH_STATE_MAX_AGE = 60 * 10;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

export async function setOAuthStateCookie(state: string) {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    ...cookieOptions,
    maxAge: OAUTH_STATE_MAX_AGE,
  });
}

// Reads and immediately deletes the state cookie — it's only ever meant to
// be checked once, at the end of a single OAuth round trip.
export async function consumeOAuthStateCookie() {
  const cookieStore = await cookies();
  const state = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  return state;
}

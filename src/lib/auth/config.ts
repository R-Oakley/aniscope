import "server-only";

// Must exactly match the redirect URL registered in AniList's developer
// settings — AniList rejects the request otherwise. Hardcoded to localhost
// for this local learning project; a real deployment would need this to
// vary by environment.
export const ANILIST_REDIRECT_URI = "http://localhost:3000/api/auth/callback";

export const ANILIST_CLIENT_ID = process.env.ANILIST_CLIENT_ID;
export const ANILIST_CLIENT_SECRET = process.env.ANILIST_CLIENT_SECRET;

export const ANILIST_AUTHORIZE_URL = "https://anilist.co/api/v2/oauth/authorize";
export const ANILIST_TOKEN_URL = "https://anilist.co/api/v2/oauth/token";

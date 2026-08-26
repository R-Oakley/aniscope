import { NextResponse, type NextRequest } from "next/server";

import { clearAccessTokenCookie } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await clearAccessTokenCookie();
  return NextResponse.redirect(new URL("/", request.url));
}

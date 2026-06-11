// Server-side session helpers shared by the auth route handlers and the
// backend proxy. Tokens live in httpOnly cookies — never readable by JS.
import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "zanzo_access";
export const REFRESH_COOKIE = "zanzo_refresh";

const ACCESS_MAX_AGE = 60 * 30; // mirrors backend jwt_access_ttl_minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 14; // mirrors jwt_refresh_ttl_days

export type TokenPair = { access_token: string; refresh_token: string };

export function setSessionCookies(resp: NextResponse, tokens: TokenPair) {
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  resp.cookies.set(ACCESS_COOKIE, tokens.access_token, { ...base, maxAge: ACCESS_MAX_AGE });
  resp.cookies.set(REFRESH_COOKIE, tokens.refresh_token, { ...base, maxAge: REFRESH_MAX_AGE });
}

export function clearSessionCookies(resp: NextResponse) {
  resp.cookies.delete(ACCESS_COOKIE);
  resp.cookies.delete(REFRESH_COOKIE);
}

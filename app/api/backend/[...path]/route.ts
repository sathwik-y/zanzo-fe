import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setSessionCookies,
  type TokenPair,
} from "@/lib/session";

// Server-side proxy: forwards the user's JWT (from httpOnly cookies) to the
// backend. The browser never sees tokens; on an expired access token the proxy
// refreshes transparently and rotates the cookies on the response.
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

async function callBackend(req: NextRequest, target: string, token: string | undefined, body: string | undefined) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  return fetch(target, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
    cache: "no-store",
  });
}

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const search = new URL(req.url).search;
  const target = `${BACKEND}/${path.join("/")}${search}`;
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let resp = await callBackend(req, target, req.cookies.get(ACCESS_COOKIE)?.value, body);

  // Access token expired? Refresh once and retry.
  let rotated: TokenPair | null = null;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (resp.status === 401 && refreshToken) {
    const refreshResp = await fetch(`${BACKEND}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (refreshResp.ok) {
      rotated = await refreshResp.json();
      resp = await callBackend(req, target, rotated!.access_token, body);
    }
  }

  const respHeaders: Record<string, string> = {
    "content-type": resp.headers.get("content-type") ?? "application/json",
  };
  const disposition = resp.headers.get("content-disposition");
  if (disposition) respHeaders["content-disposition"] = disposition;

  const out = new NextResponse(resp.status === 204 ? null : await resp.arrayBuffer(), {
    status: resp.status,
    headers: respHeaders,
  });
  if (rotated) setSessionCookies(out, rotated);
  return out;
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };

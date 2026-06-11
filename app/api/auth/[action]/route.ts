import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL as BACKEND } from "@/lib/backend";
import { clearSessionCookies, setSessionCookies } from "@/lib/session";

// POST /api/auth/login | signup | logout — exchanges credentials with the
// backend and stores the JWT pair in httpOnly cookies.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (action === "logout") {
    const resp = NextResponse.json({ ok: true });
    clearSessionCookies(resp);
    return resp;
  }

  if (action !== "login" && action !== "signup") {
    return NextResponse.json({ detail: "unknown action" }, { status: 404 });
  }

  const upstream = await fetch(`${BACKEND}/auth/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text(),
    cache: "no-store",
  });
  const body = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(body, { status: upstream.status });
  }

  const resp = NextResponse.json({ user: body.user });
  setSessionCookies(resp, body);
  return resp;
}

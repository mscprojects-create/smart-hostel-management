import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

// Use 303 "See Other" so the browser follows the redirect with a GET request.
// (A default 307 redirect would re-POST to /login — which is a GET-only page —
// causing a server error and no redirect to the login screen.)
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}

// Allow signing out via a plain link/GET too, as a fallback.
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}

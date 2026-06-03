import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "hostel_session";

type Role = "ADMIN" | "WARDEN" | "STUDENT";

const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  WARDEN: "/warden",
  STUDENT: "/student",
};

async function readRole(token: string | undefined): Promise<Role | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as Role) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const role = await readRole(token);

  // Visiting /login while already authenticated -> bounce to dashboard.
  if (pathname === "/login" && role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }

  const guard: { prefix: string; role: Role }[] = [
    { prefix: "/admin", role: "ADMIN" },
    { prefix: "/warden", role: "WARDEN" },
    { prefix: "/student", role: "STUDENT" },
  ];

  for (const g of guard) {
    if (pathname.startsWith(g.prefix)) {
      if (!role) {
        const url = new URL("/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      if (role !== g.role) {
        // Logged in but wrong area -> send to their own dashboard.
        return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/warden/:path*", "/student/:path*"],
};

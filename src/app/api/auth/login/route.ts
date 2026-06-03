import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const ok = await verifyPassword(String(password), user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.status === "PENDING") {
    return NextResponse.json({ error: "Your account is awaiting admin approval." }, { status: 403 });
  }
  if (user.status === "REJECTED") {
    return NextResponse.json({ error: "Your registration was rejected. Contact the warden." }, { status: 403 });
  }

  const token = await signSession({ id: user.id, name: user.name, email: user.email, role: user.role });

  const res = NextResponse.json({
    ok: true,
    role: user.role,
    redirect: user.role === "ADMIN" ? "/admin" : user.role === "WARDEN" ? "/warden" : "/student",
  });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

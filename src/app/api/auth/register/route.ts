import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, password, phone, course, year } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  await db.user.create({
    data: {
      name: String(name).trim(),
      email: cleanEmail,
      password: await hashPassword(String(password)),
      phone: phone ? String(phone) : null,
      course: course ? String(course) : null,
      year: year ? Number(year) : null,
      role: "STUDENT",
      status: "PENDING", // requires admin approval before login
    },
  });

  return NextResponse.json({ ok: true, message: "Registration submitted. Await admin approval." });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const guard = await requireRole("WARDEN", "ADMIN");
  if ("response" in guard) return guard.response;

  const { title, body } = await req.json().catch(() => ({}));
  if (!title || !body) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  await db.notice.create({
    data: { title: String(title), body: String(body), postedById: guard.session.id },
  });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const guard = await requireRole("STUDENT");
  if ("response" in guard) return guard.response;

  const { title, category, description, photoUrl } = await req.json().catch(() => ({}));
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  }

  await db.complaint.create({
    data: {
      title: String(title),
      category: category ? String(category) : "General",
      description: String(description),
      photoUrl: photoUrl ? String(photoUrl) : null,
      studentId: guard.session.id,
    },
  });
  return NextResponse.json({ ok: true });
}

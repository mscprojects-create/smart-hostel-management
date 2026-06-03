import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("WARDEN", "ADMIN");
  if ("response" in guard) return guard.response;

  await db.notice.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

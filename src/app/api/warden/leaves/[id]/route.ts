import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("WARDEN", "ADMIN");
  if ("response" in guard) return guard.response;

  const { status } = await req.json().catch(() => ({}));
  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await db.leave.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json({ ok: true });
}

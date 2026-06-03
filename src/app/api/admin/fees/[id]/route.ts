import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const { paid } = await req.json().catch(() => ({}));
  const fee = await db.fee.update({
    where: { id: params.id },
    data: { paid: Boolean(paid), paidAt: paid ? new Date() : null },
  });
  return NextResponse.json({ ok: true, fee });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const occupants = await db.user.count({ where: { roomId: params.id } });
  if (occupants > 0) {
    return NextResponse.json(
      { error: "Cannot delete a room that still has students assigned. Reallocate them first." },
      { status: 409 }
    );
  }

  await db.room.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

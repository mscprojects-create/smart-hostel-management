import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const { action, roomId } = await req.json().catch(() => ({}));
  const student = await db.user.findUnique({ where: { id: params.id } });
  if (!student || student.role !== "STUDENT") {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  if (action === "approve") {
    await db.user.update({ where: { id: params.id }, data: { status: "ACTIVE" } });
    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    await db.user.update({ where: { id: params.id }, data: { status: "REJECTED" } });
    return NextResponse.json({ ok: true });
  }

  if (action === "allocate") {
    if (!roomId) {
      // Unassign.
      await db.user.update({ where: { id: params.id }, data: { roomId: null } });
      return NextResponse.json({ ok: true });
    }
    const room = await db.room.findUnique({ where: { id: roomId }, include: { _count: { select: { students: true } } } });
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });

    const alreadyHere = student.roomId === roomId;
    if (!alreadyHere && room._count.students >= room.capacity) {
      return NextResponse.json({ error: "That room is already full." }, { status: 409 });
    }
    await db.user.update({ where: { id: params.id }, data: { roomId } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

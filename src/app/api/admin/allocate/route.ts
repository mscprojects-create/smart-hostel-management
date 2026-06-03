import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

/**
 * Automated room allocation.
 * Assigns every ACTIVE student without a room to the next room that still has
 * free capacity. Students are ordered by year (seniors first), then by name.
 */
export async function POST() {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const unassigned = await db.user.findMany({
    where: { role: "STUDENT", status: "ACTIVE", roomId: null },
    orderBy: [{ year: "desc" }, { name: "asc" }],
  });

  const rooms = await db.room.findMany({
    orderBy: [{ floor: "asc" }, { number: "asc" }],
    include: { _count: { select: { students: true } } },
  });

  // Track remaining free seats per room in memory.
  const free = rooms.map((r) => ({ id: r.id, seats: r.capacity - r._count.students }));

  let allocated = 0;
  for (const student of unassigned) {
    const slot = free.find((f) => f.seats > 0);
    if (!slot) break; // no capacity left
    await db.user.update({ where: { id: student.id }, data: { roomId: slot.id } });
    slot.seats -= 1;
    allocated += 1;
  }

  return NextResponse.json({ ok: true, allocated, remaining: unassigned.length - allocated });
}

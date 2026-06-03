import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const body = await req.json().catch(() => ({}));
  const { number, floor, capacity, type, hostelId } = body;

  if (!number || !hostelId) {
    return NextResponse.json({ error: "Room number and hostel are required." }, { status: 400 });
  }

  const room = await db.room.create({
    data: {
      number: String(number),
      floor: Number(floor) || 0,
      capacity: Number(capacity) || 1,
      type: ["SINGLE", "DOUBLE", "DORMITORY"].includes(type) ? type : "DOUBLE",
      hostelId: String(hostelId),
    },
  });

  return NextResponse.json({ ok: true, room });
}

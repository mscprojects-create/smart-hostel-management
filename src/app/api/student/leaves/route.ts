import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const guard = await requireRole("STUDENT");
  if ("response" in guard) return guard.response;

  const { type, reason, fromDate, toDate } = await req.json().catch(() => ({}));
  if (!reason || !fromDate || !toDate) {
    return NextResponse.json({ error: "Reason and dates are required." }, { status: 400 });
  }

  await db.leave.create({
    data: {
      type: type === "OUTPASS" ? "OUTPASS" : "LEAVE",
      reason: String(reason),
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      studentId: guard.session.id,
    },
  });
  return NextResponse.json({ ok: true });
}

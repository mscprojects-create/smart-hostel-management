import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const guard = await requireRole("ADMIN");
  if ("response" in guard) return guard.response;

  const { studentId, title, amount, dueDate } = await req.json().catch(() => ({}));
  if (!studentId || !title || !amount || !dueDate) {
    return NextResponse.json({ error: "Student, title, amount and due date are required." }, { status: 400 });
  }

  const fee = await db.fee.create({
    data: {
      studentId: String(studentId),
      title: String(title),
      amount: Number(amount),
      dueDate: new Date(dueDate),
    },
  });
  return NextResponse.json({ ok: true, fee });
}

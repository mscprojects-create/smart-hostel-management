import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/guard";

/**
 * Simulated payment endpoint. In a real deployment this is where you would
 * integrate a payment gateway (e.g. Razorpay / Stripe) and mark the fee paid
 * only after a verified webhook. For this project we mark it paid directly.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole("STUDENT");
  if ("response" in guard) return guard.response;

  const fee = await db.fee.findUnique({ where: { id: params.id } });
  if (!fee || fee.studentId !== guard.session.id) {
    return NextResponse.json({ error: "Fee not found." }, { status: 404 });
  }

  await db.fee.update({ where: { id: params.id }, data: { paid: true, paidAt: new Date() } });
  return NextResponse.json({ ok: true });
}

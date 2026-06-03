"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Th, Td, Badge, EmptyState } from "@/components/ui";

interface Fee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export default function FeeList({ fees }: { fees: Fee[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function pay(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/student/fees/${id}/pay`, { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setBusy("");
    }
  }

  return (
    <Card className="overflow-hidden">
      {fees.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((f) => (
                <tr key={f.id}>
                  <Td className="font-medium">{f.title}</Td>
                  <Td>₹{f.amount.toLocaleString("en-IN")}</Td>
                  <Td>{f.dueDate}</Td>
                  <Td>
                    <Badge status={f.paid ? "PAID" : "DUE"} />
                  </Td>
                  <Td>
                    {f.paid ? (
                      <span className="text-xs text-slate-400">Paid</span>
                    ) : (
                      <button
                        disabled={busy === f.id}
                        onClick={() => pay(f.id)}
                        className="rounded-md bg-brand-600 text-white text-xs px-3 py-1.5 hover:bg-brand-700 disabled:opacity-60"
                      >
                        {busy === f.id ? "Processing…" : "Pay now"}
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No fees assigned yet." />
      )}
      <p className="px-5 py-3 text-xs text-slate-400 border-t border-slate-100">
        Demo payment — marks the invoice paid instantly. Plug in a real gateway (Razorpay/Stripe) for production.
      </p>
    </Card>
  );
}

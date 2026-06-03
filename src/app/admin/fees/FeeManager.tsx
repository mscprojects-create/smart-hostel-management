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
  student: string;
}

export default function FeeManager({
  students,
  fees,
}: {
  students: { id: string; name: string }[];
  fees: Fee[];
}) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500";

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, title, amount, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed.");
      else {
        setTitle("");
        setAmount("");
        setDueDate("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function togglePaid(id: string, paid: boolean) {
    await fetch(`/api/admin/fees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 h-fit">
        <h3 className="font-semibold mb-4">Generate Invoice</h3>
        {error && <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
        <form onSubmit={createInvoice} className="space-y-3">
          <select className={input} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input className={input} placeholder="Title (e.g. Hostel Fee Sem 2)" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className={input} type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input className={input} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          <button disabled={busy} className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 disabled:opacity-60">
            {busy ? "Creating…" : "Create Invoice"}
          </button>
        </form>
      </Card>

      <Card className="lg:col-span-2 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold">All Invoices ({fees.length})</div>
        {fees.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Student</Th>
                  <Th>Title</Th>
                  <Th>Amount</Th>
                  <Th>Due</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f) => (
                  <tr key={f.id}>
                    <Td className="font-medium">{f.student}</Td>
                    <Td>{f.title}</Td>
                    <Td>₹{f.amount.toLocaleString("en-IN")}</Td>
                    <Td>{f.dueDate}</Td>
                    <Td>
                      <Badge status={f.paid ? "PAID" : "DUE"} />
                    </Td>
                    <Td>
                      <button onClick={() => togglePaid(f.id, !f.paid)} className="text-xs text-brand-700 hover:underline">
                        Mark {f.paid ? "unpaid" : "paid"}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No invoices yet." />
        )}
      </Card>
    </div>
  );
}

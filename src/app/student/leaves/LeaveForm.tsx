"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Th, Td, Badge, EmptyState } from "@/components/ui";

interface Leave {
  id: string;
  type: string;
  reason: string;
  from: string;
  to: string;
  status: string;
}

export default function LeaveForm({ leaves }: { leaves: Leave[] }) {
  const router = useRouter();
  const [type, setType] = useState("LEAVE");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const input = "field-brutal";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/student/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, reason, fromDate, toDate }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed.");
      else {
        setReason("");
        setFromDate("");
        setToDate("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 h-fit">
        <h3 className="font-semibold mb-4">Apply</h3>
        {error && <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="LEAVE">Leave (overnight)</option>
            <option value="OUTPASS">Out-pass (same day)</option>
          </select>
          <textarea className={input} rows={3} placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
          <div>
            <label className="text-xs text-slate-500">From</label>
            <input className={input} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-slate-500">To</label>
            <input className={input} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
          </div>
          <button disabled={busy} className="btn-brutal w-full py-3">
            {busy ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </Card>

      <Card className="lg:col-span-2 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold">My Applications</div>
        {leaves.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Type</Th>
                  <Th>Reason</Th>
                  <Th>Dates</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <Td>{l.type}</Td>
                    <Td>{l.reason}</Td>
                    <Td>
                      {l.from} → {l.to}
                    </Td>
                    <Td>
                      <Badge status={l.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No applications yet." />
        )}
      </Card>
    </div>
  );
}

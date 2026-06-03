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
  student: string;
  room: string | null;
}

export default function LeaveApprovals({ leaves }: { leaves: Leave[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function setStatus(id: string, status: string) {
    setBusy(id);
    try {
      await fetch(`/api/warden/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  return (
    <Card className="overflow-hidden">
      {leaves.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <Th>Student</Th>
                <Th>Type</Th>
                <Th>Reason</Th>
                <Th>Dates</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((l) => (
                <tr key={l.id}>
                  <Td className="font-medium">
                    {l.student}
                    {l.room ? <span className="text-slate-400"> · Rm {l.room}</span> : null}
                  </Td>
                  <Td>{l.type}</Td>
                  <Td>{l.reason}</Td>
                  <Td>
                    {l.from} → {l.to}
                  </Td>
                  <Td>
                    <Badge status={l.status} />
                  </Td>
                  <Td>
                    {l.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={busy === l.id}
                          onClick={() => setStatus(l.id, "APPROVED")}
                          className="rounded-md bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          disabled={busy === l.id}
                          onClick={() => setStatus(l.id, "REJECTED")}
                          className="rounded-md border border-slate-300 text-slate-600 text-xs px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setStatus(l.id, "PENDING")} className="text-xs text-slate-500 hover:underline">
                        Reset
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No leave requests yet." />
      )}
    </Card>
  );
}

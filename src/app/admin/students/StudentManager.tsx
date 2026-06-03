"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Th, Td, EmptyState } from "@/components/ui";

interface Pending {
  id: string;
  name: string;
  email: string;
  course: string | null;
  year: number | null;
}
interface Active extends Pending {
  roomId: string | null;
  roomNumber: string | null;
}
interface Room {
  id: string;
  number: string;
  capacity: number;
  occupied: number;
}

export default function StudentManager({
  pending,
  active,
  rooms,
}: {
  pending: Pending[];
  active: Active[];
  rooms: Room[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function act(id: string, body: object) {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Action failed.");
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function autoAllocate() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/allocate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Allocation failed.");
      else {
        setError("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold flex items-center gap-2">
          Pending Approvals
          {pending.length > 0 && (
            <span className="rounded-full bg-amber-100 text-amber-800 text-xs px-2 py-0.5">{pending.length}</span>
          )}
        </div>
        {pending.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Course</Th>
                  <Th>Year</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pending.map((p) => (
                  <tr key={p.id}>
                    <Td className="font-medium">{p.name}</Td>
                    <Td>{p.email}</Td>
                    <Td>{p.course ?? "—"}</Td>
                    <Td>{p.year ?? "—"}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => act(p.id, { action: "approve" })}
                          className="rounded-md bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => act(p.id, { action: "reject" })}
                          className="rounded-md border border-slate-300 text-slate-600 text-xs px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No pending registrations." />
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold">Active Students ({active.length})</span>
          <button
            disabled={busy}
            onClick={autoAllocate}
            className="rounded-lg bg-brand-600 text-white text-xs font-medium px-3 py-2 hover:bg-brand-700 disabled:opacity-60"
          >
            ⚡ Auto-allocate rooms
          </button>
        </div>
        {active.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Name</Th>
                  <Th>Course</Th>
                  <Th>Year</Th>
                  <Th>Room</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {active.map((a) => (
                  <tr key={a.id}>
                    <Td className="font-medium">{a.name}</Td>
                    <Td>{a.course ?? "—"}</Td>
                    <Td>{a.year ?? "—"}</Td>
                    <Td>
                      <select
                        disabled={busy}
                        value={a.roomId ?? ""}
                        onChange={(e) => act(a.id, { action: "allocate", roomId: e.target.value || null })}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {rooms.map((r) => {
                          const full = r.occupied >= r.capacity && r.id !== a.roomId;
                          return (
                            <option key={r.id} value={r.id} disabled={full}>
                              Room {r.number} ({r.occupied}/{r.capacity}){full ? " — full" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No active students yet." />
        )}
      </Card>
    </div>
  );
}

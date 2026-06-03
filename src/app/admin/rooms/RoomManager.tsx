"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Th, Td, EmptyState } from "@/components/ui";

interface Room {
  id: string;
  number: string;
  floor: number;
  capacity: number;
  type: string;
  hostel: string;
  occupied: number;
}

export default function RoomManager({
  hostels,
  rooms,
}: {
  hostels: { id: string; name: string }[];
  rooms: Room[];
}) {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("1");
  const [capacity, setCapacity] = useState("2");
  const [type, setType] = useState("DOUBLE");
  const [hostelId, setHostelId] = useState(hostels[0]?.id ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const input = "field-brutal";

  async function addRoom(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, floor, capacity, type, hostelId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add room.");
        return;
      }
      setNumber("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function removeRoom(id: string) {
    setError("");
    const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to delete room.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-1 h-fit">
        <h3 className="font-semibold mb-4">Add Room</h3>
        {error && <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
        <form onSubmit={addRoom} className="space-y-3">
          <div>
            <label className="text-xs text-slate-500">Hostel Block</label>
            <select className={input} value={hostelId} onChange={(e) => setHostelId(e.target.value)}>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Room Number</label>
            <input className={input} value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="e.g. 103" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-500">Floor</label>
              <input className={input} type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500">Capacity</label>
              <input className={input} type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500">Type</label>
            <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="DORMITORY">Dormitory</option>
            </select>
          </div>
          <button
            disabled={busy}
            className="btn-brutal w-full py-3"
          >
            {busy ? "Adding…" : "Add Room"}
          </button>
        </form>
      </Card>

      <Card className="lg:col-span-2 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold">All Rooms ({rooms.length})</div>
        {rooms.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Room</Th>
                  <Th>Block</Th>
                  <Th>Floor</Th>
                  <Th>Type</Th>
                  <Th>Occupancy</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <Td className="font-medium">{r.number}</Td>
                    <Td>{r.hostel}</Td>
                    <Td>{r.floor}</Td>
                    <Td>{r.type.toLowerCase()}</Td>
                    <Td>
                      <span className={r.occupied >= r.capacity ? "text-red-600" : "text-green-600"}>
                        {r.occupied}/{r.capacity}
                      </span>
                    </Td>
                    <Td>
                      <button onClick={() => removeRoom(r.id)} className="text-xs text-red-600 hover:underline">
                        Delete
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No rooms yet. Add one on the left." />
        )}
      </Card>
    </div>
  );
}

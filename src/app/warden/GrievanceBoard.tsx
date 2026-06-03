"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, EmptyState } from "@/components/ui";

interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  photoUrl: string | null;
  student: string;
  room: string | null;
  createdAt: string;
}

const FILTERS = ["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"];

export default function GrievanceBoard({ complaints }: { complaints: Complaint[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState("");

  async function setStatus(id: string, status: string) {
    setBusy(id);
    try {
      await fetch(`/api/warden/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  const shown = complaints.filter((c) => filter === "ALL" || c.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
              filter === f ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.category} · {c.student}
                    {c.room ? ` · Room ${c.room}` : ""} · {c.createdAt}
                  </div>
                </div>
                <Badge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 mt-3">{c.description}</p>
              {c.photoUrl && (
                <a href={c.photoUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-700 hover:underline mt-2 inline-block">
                  View attached photo
                </a>
              )}
              <div className="mt-4 flex gap-2">
                {["PENDING", "IN_PROGRESS", "RESOLVED"].map((s) => (
                  <button
                    key={s}
                    disabled={busy === c.id || c.status === s}
                    onClick={() => setStatus(c.id, s)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium border disabled:opacity-50 ${
                      c.status === s ? "bg-slate-100 text-slate-400 border-slate-200" : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState message="No complaints in this category." />
      )}
    </div>
  );
}

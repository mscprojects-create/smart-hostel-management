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
  createdAt: string;
}

const CATEGORIES = ["Electrical", "Plumbing", "Internet", "Furniture", "Cleanliness", "General"];

export default function Helpdesk({ complaints }: { complaints: Complaint[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/student/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed.");
      else {
        setTitle("");
        setDescription("");
        setPhotoUrl("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 h-fit">
        <h3 className="font-semibold mb-4">Raise a Ticket</h3>
        {error && <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className={input} placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <textarea className={input} rows={4} placeholder="Describe the issue…" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input className={input} placeholder="Photo URL (optional)" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          <p className="text-xs text-slate-400">Paste a link to a photo of the issue if you have one.</p>
          <button disabled={busy} className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 disabled:opacity-60">
            {busy ? "Submitting…" : "Submit Ticket"}
          </button>
        </form>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {complaints.length ? (
          complaints.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.category} · {c.createdAt}
                  </div>
                </div>
                <Badge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 mt-2">{c.description}</p>
              {c.photoUrl && (
                <a href={c.photoUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-700 hover:underline mt-2 inline-block">
                  View photo
                </a>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-5">
            <EmptyState message="You haven't raised any tickets yet." />
          </Card>
        )}
      </div>
    </div>
  );
}

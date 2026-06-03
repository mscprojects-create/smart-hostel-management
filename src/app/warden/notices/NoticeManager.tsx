"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, EmptyState } from "@/components/ui";

interface Notice {
  id: string;
  title: string;
  body: string;
  by: string;
  createdAt: string;
}

export default function NoticeManager({ notices }: { notices: Notice[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500";

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/warden/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed.");
      else {
        setTitle("");
        setBody("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/warden/notices/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 h-fit">
        <h3 className="font-semibold mb-4">New Announcement</h3>
        {error && <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
        <form onSubmit={post} className="space-y-3">
          <input className={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className={input} rows={5} placeholder="Message…" value={body} onChange={(e) => setBody(e.target.value)} required />
          <button disabled={busy} className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 disabled:opacity-60">
            {busy ? "Posting…" : "Post Notice"}
          </button>
        </form>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {notices.length ? (
          notices.map((n) => (
            <Card key={n.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{n.title}</h3>
                <button onClick={() => remove(n.id)} className="text-xs text-red-600 hover:underline shrink-0">
                  Delete
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{n.body}</p>
              <div className="text-xs text-slate-400 mt-3">
                Posted by {n.by} · {n.createdAt}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5">
            <EmptyState message="No notices posted yet." />
          </Card>
        )}
      </div>
    </div>
  );
}

import React from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  accent = "brand",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: "brand" | "green" | "amber" | "red";
}) {
  const colors: Record<string, string> = {
    brand: "text-brand-700 bg-brand-50",
    green: "text-green-700 bg-green-50",
    amber: "text-amber-700 bg-amber-50",
    red: "text-red-700 bg-red-50",
  };
  return (
    <Card className="p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {hint && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[accent]}`}>{hint}</span>}
      </div>
    </Card>
  );
}

export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ACTIVE: "bg-green-100 text-green-800",
    PAID: "bg-green-100 text-green-800",
    DUE: "bg-red-100 text-red-800",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="text-center text-slate-400 text-sm py-10">{message}</div>;
}

/** Simple dependency-free horizontal bar chart. */
export function BarChart({ data }: { data: { label: string; value: number; max?: number }[] }) {
  const globalMax = Math.max(1, ...data.map((d) => d.max ?? d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const max = d.max ?? globalMax;
        const pct = Math.min(100, Math.round((d.value / Math.max(1, max)) * 100));
        return (
          <div key={d.label}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>{d.label}</span>
              <span className="font-medium">
                {d.value}
                {d.max ? ` / ${d.max}` : ""}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">{children}</th>;
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>;
}

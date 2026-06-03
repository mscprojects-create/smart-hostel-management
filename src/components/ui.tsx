import React from "react";

export function PageHeader({ title, subtitle, kicker }: { title: string; subtitle?: string; kicker?: string }) {
  return (
    <div className="mb-7">
      {kicker && <div className="label-mono mb-2">{kicker}</div>}
      <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">{title}</h1>
      <div className="mt-3 h-1 w-16 bg-cobalt" />
      {subtitle && <p className="mt-3 max-w-2xl font-mono text-xs text-ink/60">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card-brutal ${className}`}>{children}</div>;
}

type Accent = "cobalt" | "coral" | "sun" | "grass" | "ultra" | "ink" | "paper";

const ACCENT_BG: Record<Accent, string> = {
  cobalt: "bg-cobalt text-white",
  coral: "bg-coral text-white",
  sun: "bg-sun text-ink",
  grass: "bg-grass text-white",
  ultra: "bg-ultra text-white",
  ink: "bg-ink text-paper",
  paper: "bg-panel text-ink",
};

export function StatCard({
  label,
  value,
  hint,
  index,
  accent = "paper",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  index?: string;
  accent?: Accent;
}) {
  const isDark = accent !== "sun" && accent !== "paper";
  return (
    <div className={`relative overflow-hidden border-2 border-ink shadow-brutal ${ACCENT_BG[accent]}`}>
      <div className="flex items-start justify-between px-5 pt-4">
        <div className={`font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? "text-white/75" : "text-ink/60"}`}>
          {label}
        </div>
        {index && (
          <div className={`font-mono text-[11px] font-bold ${isDark ? "text-white/55" : "text-ink/40"}`}>{index}</div>
        )}
      </div>
      <div className="px-5 pb-5 pt-2">
        <div className="font-display text-4xl leading-none tracking-tight">{value}</div>
        {hint && (
          <div className={`mt-2 inline-block border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${isDark ? "border-white/40 text-white/85" : "border-ink/30 text-ink/70"}`}>
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-sun text-ink",
    IN_PROGRESS: "bg-cobalt text-white",
    RESOLVED: "bg-grass text-white",
    APPROVED: "bg-grass text-white",
    REJECTED: "bg-coral text-white",
    ACTIVE: "bg-grass text-white",
    PAID: "bg-grass text-white",
    DUE: "bg-coral text-white",
  };
  const cls = map[status] ?? "bg-panel text-ink";
  return <span className={`tag ${cls}`}>{status.replace("_", " ")}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <div className="h-3 w-3 rotate-45 border-2 border-ink/30" />
      <div className="font-mono text-xs uppercase tracking-wider text-ink/45">{message}</div>
    </div>
  );
}

/** Thick, hard-edged horizontal bars. */
export function BarChart({ data }: { data: { label: string; value: number; max?: number }[] }) {
  const globalMax = Math.max(1, ...data.map((d) => d.max ?? d.value));
  return (
    <div className="space-y-4">
      {data.map((d) => {
        const max = d.max ?? globalMax;
        const pct = Math.min(100, Math.round((d.value / Math.max(1, max)) * 100));
        const full = d.max ? d.value >= d.max : false;
        return (
          <div key={d.label}>
            <div className="mb-1 flex justify-between font-mono text-[11px] uppercase tracking-wider text-ink/70">
              <span>{d.label}</span>
              <span className="font-bold text-ink">
                {d.value}
                {d.max ? `/${d.max}` : ""}
              </span>
            </div>
            <div className="h-5 border-2 border-ink bg-white">
              <div className={`h-full ${full ? "bg-coral" : "bg-cobalt"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b-2 border-ink px-4 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-ink/60">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-ink/80 ${className}`}>{children}</td>;
}

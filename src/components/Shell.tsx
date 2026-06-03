"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const ROLE_TINT: Record<string, string> = {
  Admin: "bg-coral text-white",
  Warden: "bg-sun text-ink",
  Student: "bg-grass text-white",
};

export default function Shell({
  brand,
  roleLabel,
  userName,
  nav,
  children,
}: {
  brand: string;
  roleLabel: string;
  userName: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tint = ROLE_TINT[roleLabel] ?? "bg-cobalt text-white";

  const SidebarInner = (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="border-b-2 border-paper/15 px-5 py-5">
        <div className="font-display text-xl uppercase leading-none tracking-tight">{brand}</div>
        <div className={`mt-2 inline-block border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${tint}`}>
          {roleLabel} Portal
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 border-2 px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-100 ${
                active
                  ? "border-ink bg-sun text-ink shadow-[3px_3px_0_0_#FFC233]"
                  : "border-transparent text-paper/65 hover:border-paper/25 hover:bg-white/5 hover:text-paper"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t-2 border-paper/15 px-4 py-4">
        <div className="px-1 pb-3">
          <div className="font-display text-sm uppercase tracking-tight">{userName}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">{roleLabel}</div>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="w-full border-2 border-paper bg-coral px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-100 hover:-translate-y-0.5 active:translate-y-0">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 border-r-2 border-ink lg:flex">{SidebarInner}</aside>

      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-3 text-paper lg:hidden">
        <div className="font-display text-base uppercase tracking-tight">{brand}</div>
        <button
          onClick={() => setOpen(!open)}
          className="border-2 border-paper px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider"
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 border-r-2 border-ink">{SidebarInner}</div>
          <div className="flex-1 bg-ink/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="min-w-0 flex-1 p-5 lg:p-9">{children}</main>
    </div>
  );
}

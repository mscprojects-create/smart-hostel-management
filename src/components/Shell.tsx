"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

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

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5 border-b border-brand-700/40">
        <div className="text-lg font-bold tracking-tight">🏠 {brand}</div>
        <div className="text-xs text-brand-200 mt-0.5">{roleLabel} Portal</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-white text-brand-800" : "text-brand-100 hover:bg-brand-700/60"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-brand-700/40">
        <div className="px-3 pb-3">
          <div className="text-sm font-medium">{userName}</div>
          <div className="text-xs text-brand-200">{roleLabel}</div>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="w-full rounded-lg bg-brand-700/60 hover:bg-brand-700 text-white text-sm py-2">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-brand-800 text-white">{SidebarInner}</aside>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-brand-800 text-white px-4 py-3">
        <div className="font-bold">🏠 {brand}</div>
        <button onClick={() => setOpen(!open)} className="rounded-md border border-white/30 px-3 py-1 text-sm">
          Menu
        </button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-brand-800 text-white">{SidebarInner}</div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="flex-1 min-w-0 p-5 lg:p-8">{children}</main>
    </div>
  );
}

import { Suspense } from "react";
import AuthForm from "./AuthForm";

export const metadata = { title: "Login · Smart Hostel" };

const TICKER = ["ROOMS", "FEES", "GRIEVANCES", "LEAVE", "MESS", "NOTICES", "ATTENDANCE"];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left: bulletin-board hero */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r-2 border-ink bg-cobalt p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border-2 border-white bg-white font-display text-base text-cobalt">SH</div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Smart Hostel</span>
        </div>

        <div>
          <div className="mb-4 inline-block border-2 border-white bg-sun px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
            Est. Campus 2026
          </div>
          <h1 className="font-display text-[4.2rem] uppercase leading-[0.86] tracking-tight">
            Hostel
            <br />
            <span className="text-sun">Operations,</span>
            <br />
            Pinned Down.
          </h1>
          <p className="mt-6 max-w-sm font-mono text-xs leading-relaxed text-white/80">
            One board for the whole hostel — rooms, dues, grievances, leave and mess. Three roles, one
            source of truth.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {["Role-based access", "Digital grievances", "Out-pass approvals", "Fee tracking"].map((f) => (
              <span key={f} className="border-2 border-white px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Marquee ledger strip */}
        <div className="relative -mx-12 -mb-12 overflow-hidden border-t-2 border-white bg-ink py-3">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="mx-6 font-mono text-xs font-bold uppercase tracking-[0.25em] text-paper/80">
                {t} <span className="text-sun">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6">
        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}

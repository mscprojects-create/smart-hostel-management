"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "register";

const DEMO = [
  { label: "Admin", email: "admin@hostel.edu", password: "admin123", tint: "bg-coral text-white" },
  { label: "Warden", email: "warden@hostel.edu", password: "warden123", tint: "bg-sun text-ink" },
  { label: "Student", email: "rahul@hostel.edu", password: "student123", tint: "bg-grass text-white" },
];

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push(params.get("next") || data.redirect || "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, course, year }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      setInfo("Registration submitted. An admin will approve your account.");
      setMode("login");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(d: (typeof DEMO)[number]) {
    setMode("login");
    setEmail(d.email);
    setPassword(d.password);
    setError("");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-cobalt font-display text-sm text-white">SH</div>
        <span className="font-display text-lg uppercase tracking-tight">Smart Hostel</span>
      </div>

      <div className="label-mono mb-2">{mode === "login" ? "// Sign in" : "// New student"}</div>
      <h2 className="font-display text-3xl uppercase leading-none tracking-tight">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h2>
      <div className="mt-3 h-1 w-12 bg-coral" />

      {error && (
        <div className="mt-5 border-2 border-ink bg-coral px-3 py-2 font-mono text-xs font-bold text-white">{error}</div>
      )}
      {info && (
        <div className="mt-5 border-2 border-ink bg-grass px-3 py-2 font-mono text-xs font-bold text-white">{info}</div>
      )}

      <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="mt-6 space-y-3">
        {mode === "register" && (
          <input className="field-brutal" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input className="field-brutal" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field-brutal" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {mode === "register" && (
          <>
            <input className="field-brutal" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="flex gap-3">
              <input className="field-brutal" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
              <input className="field-brutal" type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </>
        )}
        <button type="submit" disabled={loading} className="btn-brutal w-full py-3">
          {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Register →"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
          setInfo("");
        }}
        className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-cobalt underline-offset-4 hover:underline"
      >
        {mode === "login" ? "New student? Create account" : "Have an account? Sign in"}
      </button>

      <div className="mt-8 border-t-2 border-ink pt-5">
        <p className="label-mono mb-2">Quick demo login</p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO.map((d) => (
            <button
              key={d.label}
              onClick={() => fillDemo(d)}
              className={`border-2 border-ink py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm transition-all duration-100 hover:-translate-y-0.5 active:translate-y-0 ${d.tint}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

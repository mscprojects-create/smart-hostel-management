"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "register";

const DEMO = [
  { label: "Admin", email: "admin@hostel.edu", password: "admin123" },
  { label: "Warden", email: "warden@hostel.edu", password: "warden123" },
  { label: "Student", email: "rahul@hostel.edu", password: "student123" },
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
      setInfo("Registration submitted! An admin will approve your account shortly.");
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

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden text-center text-2xl font-bold text-brand-800 mb-6">🏠 Smart Hostel</div>
      <h2 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create student account"}</h2>
      <p className="text-slate-500 text-sm mt-1">
        {mode === "login" ? "Sign in to your dashboard." : "Register and wait for admin approval."}
      </p>

      {error && <div className="mt-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
      {info && <div className="mt-4 rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2">{info}</div>}

      <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="mt-5 space-y-3">
        {mode === "register" && (
          <input className={input} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === "register" && (
          <>
            <input className={input} placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="flex gap-3">
              <input className={input} placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
              <input
                className={input}
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
          setInfo("");
        }}
        className="mt-4 text-sm text-brand-700 hover:underline"
      >
        {mode === "login" ? "New student? Create an account" : "Already have an account? Sign in"}
      </button>

      <div className="mt-8 border-t pt-5">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Quick demo login</p>
        <div className="flex gap-2">
          {DEMO.map((d) => (
            <button
              key={d.label}
              onClick={() => fillDemo(d)}
              className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-xs font-medium hover:border-brand-500 hover:text-brand-700"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

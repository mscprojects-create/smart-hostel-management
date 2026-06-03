import { Suspense } from "react";
import AuthForm from "./AuthForm";

export const metadata = { title: "Login · Smart Hostel" };

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-800 text-white p-12">
        <div className="text-xl font-semibold tracking-tight">🏠 Smart Hostel</div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Hostel management,
            <br /> made simple.
          </h1>
          <p className="mt-4 text-brand-100 max-w-md">
            Rooms, fees, attendance, grievances and mess — one clean portal for admins,
            wardens and students.
          </p>
          <ul className="mt-8 space-y-2 text-brand-100 text-sm">
            <li>• Role-based secure dashboards</li>
            <li>• Digital grievance redressal &amp; ticketing</li>
            <li>• Leave / out-pass approvals</li>
            <li>• Fee tracking &amp; mess menu</li>
          </ul>
        </div>
        <div className="text-brand-200 text-xs">© {new Date().getFullYear()} Smart Hostel Management System</div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}

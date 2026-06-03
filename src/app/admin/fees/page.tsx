import { db } from "@/lib/db";
import { PageHeader, StatCard } from "@/components/ui";
import FeeManager from "./FeeManager";

export const dynamic = "force-dynamic";

export default async function FeesPage() {
  const [fees, students] = await Promise.all([
    db.fee.findMany({ orderBy: { dueDate: "asc" }, include: { student: true } }),
    db.user.findMany({ where: { role: "STUDENT", status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);

  const collected = fees.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0);
  const pending = fees.filter((f) => !f.paid).reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <PageHeader title="Fee Management" subtitle="Generate invoices and track payments." />
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Total Invoiced" value={`₹${(collected + pending).toLocaleString("en-IN")}`} accent="brand" />
        <StatCard label="Collected" value={`₹${collected.toLocaleString("en-IN")}`} hint="paid" accent="green" />
        <StatCard label="Outstanding" value={`₹${pending.toLocaleString("en-IN")}`} hint="due" accent="red" />
      </div>
      <FeeManager
        students={students.map((s) => ({ id: s.id, name: s.name }))}
        fees={fees.map((f) => ({
          id: f.id,
          title: f.title,
          amount: f.amount,
          dueDate: f.dueDate.toISOString().slice(0, 10),
          paid: f.paid,
          student: f.student.name,
        }))}
      />
    </div>
  );
}

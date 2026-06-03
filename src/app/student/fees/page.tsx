import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/ui";
import FeeList from "./FeeList";

export const dynamic = "force-dynamic";

export default async function StudentFees() {
  const session = await getSession();
  const fees = await db.fee.findMany({ where: { studentId: session!.id }, orderBy: { dueDate: "asc" } });

  const due = fees.filter((f) => !f.paid).reduce((s, f) => s + f.amount, 0);
  const paid = fees.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <PageHeader title="My Fees" subtitle="View your fee breakdown and pay online." />
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <StatCard label="Outstanding" value={`₹${due.toLocaleString("en-IN")}`} hint={due ? "due" : "clear"} accent={due ? "red" : "green"} />
        <StatCard label="Paid" value={`₹${paid.toLocaleString("en-IN")}`} accent="green" />
      </div>
      <FeeList
        fees={fees.map((f) => ({
          id: f.id,
          title: f.title,
          amount: f.amount,
          dueDate: f.dueDate.toISOString().slice(0, 10),
          paid: f.paid,
        }))}
      />
    </div>
  );
}

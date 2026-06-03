import { db } from "@/lib/db";
import { PageHeader, StatCard, Card, BarChart, Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [students, rooms, fees, complaints, pendingApprovals, recent] = await Promise.all([
    db.user.count({ where: { role: "STUDENT", status: "ACTIVE" } }),
    db.room.findMany({ include: { _count: { select: { students: true } } }, orderBy: { number: "asc" } }),
    db.fee.findMany(),
    db.complaint.count({ where: { status: { in: ["PENDING", "IN_PROGRESS"] } } }),
    db.user.count({ where: { role: "STUDENT", status: "PENDING" } }),
    db.complaint.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { student: true } }),
  ]);

  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const occupied = rooms.reduce((s, r) => s + r._count.students, 0);
  const occupancyPct = totalCapacity ? Math.round((occupied / totalCapacity) * 100) : 0;
  const pendingDues = fees.filter((f) => !f.paid).reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <PageHeader kicker="// Control room" title="Admin Dashboard" subtitle="Overview of hostel occupancy, dues and grievances." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index="01" label="Active Students" value={students} hint="residents" accent="cobalt" />
        <StatCard index="02" label="Occupancy" value={`${occupancyPct}%`} hint={`${occupied}/${totalCapacity} beds`} accent="grass" />
        <StatCard index="03" label="Pending Dues" value={`₹${pendingDues.toLocaleString("en-IN")}`} hint="unpaid" accent="coral" />
        <StatCard index="04" label="Open Complaints" value={complaints} hint="unresolved" accent="sun" />
      </div>

      <div className="grid gap-5 mt-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg uppercase tracking-tight">Room Occupancy</h3>
          {rooms.length ? (
            <BarChart
              data={rooms.map((r) => ({ label: `Room ${r.number} (${r.type.toLowerCase()})`, value: r._count.students, max: r.capacity }))}
            />
          ) : (
            <EmptyState message="No rooms yet. Add rooms from Hostel & Rooms." />
          )}
          {pendingApprovals > 0 && (
            <div className="mt-5 border-2 border-ink bg-sun px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink">
              {pendingApprovals} student registration{pendingApprovals > 1 ? "s" : ""} awaiting approval.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg uppercase tracking-tight">Recent Complaints</h3>
          {recent.length ? (
            <ul className="divide-y divide-slate-100">
              {recent.map((c) => (
                <li key={c.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{c.title}</div>
                    <div className="text-xs text-slate-500">
                      {c.category} · {c.student.name}
                    </div>
                  </div>
                  <Badge status={c.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No complaints yet." />
          )}
        </Card>
      </div>
    </div>
  );
}

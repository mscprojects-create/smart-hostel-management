import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader, StatCard, Card, Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export default async function StudentDashboard() {
  const session = await getSession();
  const id = session!.id;

  const todayKey = WEEKDAYS[new Date().getDay()];

  const [me, fees, openComplaints, pendingLeaves, notices, todayMenu] = await Promise.all([
    db.user.findUnique({ where: { id }, include: { room: { include: { hostel: true, students: true } } } }),
    db.fee.findMany({ where: { studentId: id } }),
    db.complaint.count({ where: { studentId: id, status: { in: ["PENDING", "IN_PROGRESS"] } } }),
    db.leave.count({ where: { studentId: id, status: "PENDING" } }),
    db.notice.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    db.messMenu.findUnique({ where: { day: todayKey as any } }),
  ]);

  const dues = fees.filter((f) => !f.paid).reduce((s, f) => s + f.amount, 0);
  const roommates = me?.room?.students.filter((s) => s.id !== id) ?? [];

  return (
    <div>
      <PageHeader title={`Welcome, ${session!.name.split(" ")[0]} 👋`} subtitle="Your hostel at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Room" value={me?.room?.number ?? "—"} hint={me?.room?.hostel.name ?? "Unassigned"} accent="brand" />
        <StatCard label="Pending Dues" value={`₹${dues.toLocaleString("en-IN")}`} hint={dues ? "due" : "clear"} accent={dues ? "red" : "green"} />
        <StatCard label="Open Tickets" value={openComplaints} accent="amber" />
        <StatCard label="Pending Leaves" value={pendingLeaves} accent="brand" />
      </div>

      <div className="grid gap-5 mt-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">My Room</h3>
          {me?.room ? (
            <div className="text-sm text-slate-600 space-y-1">
              <div>
                <span className="text-slate-400">Block:</span> {me.room.hostel.name}
              </div>
              <div>
                <span className="text-slate-400">Room:</span> {me.room.number} (Floor {me.room.floor}, {me.room.type.toLowerCase()})
              </div>
              <div className="pt-2">
                <span className="text-slate-400">Roommates:</span>{" "}
                {roommates.length ? roommates.map((r) => r.name).join(", ") : "None"}
              </div>
            </div>
          ) : (
            <EmptyState message="No room allocated yet." />
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Today&apos;s Mess ({todayKey})</h3>
            <Link href="/student/mess" className="text-xs text-brand-700 hover:underline">
              Full week →
            </Link>
          </div>
          {todayMenu ? (
            <ul className="text-sm text-slate-600 space-y-1">
              <li><span className="text-slate-400">Breakfast:</span> {todayMenu.breakfast}</li>
              <li><span className="text-slate-400">Lunch:</span> {todayMenu.lunch}</li>
              <li><span className="text-slate-400">Snacks:</span> {todayMenu.snacks}</li>
              <li><span className="text-slate-400">Dinner:</span> {todayMenu.dinner}</li>
            </ul>
          ) : (
            <EmptyState message="Menu not set for today." />
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Latest Notices</h3>
            <Link href="/student/notices" className="text-xs text-brand-700 hover:underline">
              All →
            </Link>
          </div>
          {notices.length ? (
            <ul className="space-y-3">
              {notices.map((n) => (
                <li key={n.id}>
                  <div className="text-sm font-medium text-slate-800">{n.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-2">{n.body}</div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No notices." />
          )}
        </Card>
      </div>
    </div>
  );
}

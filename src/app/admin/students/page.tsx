import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import StudentManager from "./StudentManager";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const [pending, active, rooms] = await Promise.all([
    db.user.findMany({ where: { role: "STUDENT", status: "PENDING" }, orderBy: { createdAt: "asc" } }),
    db.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
      orderBy: { name: "asc" },
      include: { room: true },
    }),
    db.room.findMany({ orderBy: { number: "asc" }, include: { _count: { select: { students: true } } } }),
  ]);

  return (
    <div>
      <PageHeader title="Students & Approvals" subtitle="Approve registrations and allocate rooms." />
      <StudentManager
        pending={pending.map((p) => ({ id: p.id, name: p.name, email: p.email, course: p.course, year: p.year }))}
        active={active.map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          course: a.course,
          year: a.year,
          roomId: a.roomId,
          roomNumber: a.room?.number ?? null,
        }))}
        rooms={rooms.map((r) => ({ id: r.id, number: r.number, capacity: r.capacity, occupied: r._count.students }))}
      />
    </div>
  );
}

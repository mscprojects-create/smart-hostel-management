import { db } from "@/lib/db";
import { PageHeader, StatCard } from "@/components/ui";
import GrievanceBoard from "./GrievanceBoard";

export const dynamic = "force-dynamic";

export default async function WardenGrievances() {
  const complaints = await db.complaint.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { include: { room: true } } },
  });

  const pending = complaints.filter((c) => c.status === "PENDING").length;
  const inProgress = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;

  return (
    <div>
      <PageHeader kicker="// Grievance desk" title="Grievance Management" subtitle="Review and resolve complaints raised by students." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard index="01" label="Pending" value={pending} accent="sun" />
        <StatCard index="02" label="In Progress" value={inProgress} accent="cobalt" />
        <StatCard index="03" label="Resolved" value={resolved} accent="grass" />
      </div>
      <GrievanceBoard
        complaints={complaints.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          description: c.description,
          status: c.status,
          photoUrl: c.photoUrl,
          student: c.student.name,
          room: c.student.room?.number ?? null,
          createdAt: c.createdAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}

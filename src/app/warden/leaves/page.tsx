import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import LeaveApprovals from "./LeaveApprovals";

export const dynamic = "force-dynamic";

export default async function WardenLeaves() {
  const leaves = await db.leave.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { include: { room: true } } },
  });

  return (
    <div>
      <PageHeader title="Leave & Out-pass Requests" subtitle="Approve or reject student leave applications." />
      <LeaveApprovals
        leaves={leaves.map((l) => ({
          id: l.id,
          type: l.type,
          reason: l.reason,
          from: l.fromDate.toISOString().slice(0, 10),
          to: l.toDate.toISOString().slice(0, 10),
          status: l.status,
          student: l.student.name,
          room: l.student.room?.number ?? null,
        }))}
      />
    </div>
  );
}

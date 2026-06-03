import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import LeaveForm from "./LeaveForm";

export const dynamic = "force-dynamic";

export default async function StudentLeaves() {
  const session = await getSession();
  const leaves = await db.leave.findMany({
    where: { studentId: session!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Leave / Out-pass Application" subtitle="Apply for leave and track approval status." />
      <LeaveForm
        leaves={leaves.map((l) => ({
          id: l.id,
          type: l.type,
          reason: l.reason,
          from: l.fromDate.toISOString().slice(0, 10),
          to: l.toDate.toISOString().slice(0, 10),
          status: l.status,
        }))}
      />
    </div>
  );
}

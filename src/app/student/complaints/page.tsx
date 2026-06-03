import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import Helpdesk from "./Helpdesk";

export const dynamic = "force-dynamic";

export default async function StudentComplaints() {
  const session = await getSession();
  const complaints = await db.complaint.findMany({
    where: { studentId: session!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Helpdesk / Ticketing" subtitle="Raise a maintenance request and track its status." />
      <Helpdesk
        complaints={complaints.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          description: c.description,
          status: c.status,
          photoUrl: c.photoUrl,
          createdAt: c.createdAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}

import { db } from "@/lib/db";
import { PageHeader, Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentNotices() {
  const notices = await db.notice.findMany({ orderBy: { createdAt: "desc" }, include: { postedBy: true } });

  return (
    <div>
      <PageHeader title="Notice Board" subtitle="Announcements from the hostel office." />
      <div className="space-y-3 max-w-3xl">
        {notices.length ? (
          notices.map((n) => (
            <Card key={n.id} className="p-5">
              <h3 className="font-semibold text-slate-900">{n.title}</h3>
              <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{n.body}</p>
              <div className="text-xs text-slate-400 mt-3">
                {n.postedBy.name} · {n.createdAt.toISOString().slice(0, 10)}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5">
            <EmptyState message="No notices posted yet." />
          </Card>
        )}
      </div>
    </div>
  );
}

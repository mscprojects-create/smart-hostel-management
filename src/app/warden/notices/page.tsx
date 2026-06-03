import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import NoticeManager from "./NoticeManager";

export const dynamic = "force-dynamic";

export default async function WardenNotices() {
  const notices = await db.notice.findMany({ orderBy: { createdAt: "desc" }, include: { postedBy: true } });
  return (
    <div>
      <PageHeader title="Notice Board" subtitle="Post announcements visible on every student dashboard." />
      <NoticeManager
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          by: n.postedBy.name,
          createdAt: n.createdAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}

import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import RoomManager from "./RoomManager";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const [hostels, rooms] = await Promise.all([
    db.hostel.findMany({ orderBy: { name: "asc" } }),
    db.room.findMany({
      orderBy: [{ number: "asc" }],
      include: { hostel: true, _count: { select: { students: true } } },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Hostel & Room Management" subtitle="Add rooms and manage capacities across hostel blocks." />
      <RoomManager
        hostels={hostels.map((h) => ({ id: h.id, name: h.name }))}
        rooms={rooms.map((r) => ({
          id: r.id,
          number: r.number,
          floor: r.floor,
          capacity: r.capacity,
          type: r.type,
          hostel: r.hostel.name,
          occupied: r._count.students,
        }))}
      />
    </div>
  );
}

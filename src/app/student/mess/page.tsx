import { db } from "@/lib/db";
import { PageHeader, Card, Th, Td, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

const ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const FULL: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default async function MessPage() {
  const menus = await db.messMenu.findMany();
  const today = WEEKDAYS[new Date().getDay()];
  const byDay = Object.fromEntries(menus.map((m) => [m.day, m]));

  return (
    <div>
      <PageHeader title="Weekly Mess Menu" subtitle="Plan your week. Today's row is highlighted." />
      <Card className="overflow-hidden">
        {menus.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Day</Th>
                  <Th>Breakfast</Th>
                  <Th>Lunch</Th>
                  <Th>Snacks</Th>
                  <Th>Dinner</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ORDER.map((d) => {
                  const m = byDay[d];
                  const isToday = d === today;
                  return (
                    <tr key={d} className={isToday ? "bg-brand-50" : ""}>
                      <Td className="font-semibold">
                        {FULL[d]}
                        {isToday && <span className="ml-2 text-xs text-brand-700">(Today)</span>}
                      </Td>
                      <Td>{m?.breakfast ?? "—"}</Td>
                      <Td>{m?.lunch ?? "—"}</Td>
                      <Td>{m?.snacks ?? "—"}</Td>
                      <Td>{m?.dinner ?? "—"}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="Mess menu not configured yet." />
        )}
      </Card>
    </div>
  );
}

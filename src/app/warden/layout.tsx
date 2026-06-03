import { getSession } from "@/lib/auth";
import Shell, { NavItem } from "@/components/Shell";

const nav: NavItem[] = [
  { href: "/warden", label: "Grievances", icon: "🛠️" },
  { href: "/warden/leaves", label: "Leave & Out-pass", icon: "📝" },
  { href: "/warden/notices", label: "Notice Board", icon: "📢" },
];

export default async function WardenLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <Shell brand="Smart Hostel" roleLabel="Warden" userName={session?.name ?? "Warden"} nav={nav}>
      {children}
    </Shell>
  );
}

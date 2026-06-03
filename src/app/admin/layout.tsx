import { getSession } from "@/lib/auth";
import Shell, { NavItem } from "@/components/Shell";

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/rooms", label: "Hostel & Rooms", icon: "🛏️" },
  { href: "/admin/students", label: "Students & Approvals", icon: "👥" },
  { href: "/admin/fees", label: "Fee Management", icon: "💳" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <Shell brand="Smart Hostel" roleLabel="Admin" userName={session?.name ?? "Admin"} nav={nav}>
      {children}
    </Shell>
  );
}

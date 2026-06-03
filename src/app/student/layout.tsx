import { getSession } from "@/lib/auth";
import Shell, { NavItem } from "@/components/Shell";

const nav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: "🏠" },
  { href: "/student/complaints", label: "Helpdesk", icon: "🛠️" },
  { href: "/student/leaves", label: "Leave / Out-pass", icon: "📝" },
  { href: "/student/fees", label: "Fees", icon: "💳" },
  { href: "/student/mess", label: "Mess Menu", icon: "🍽️" },
  { href: "/student/notices", label: "Notices", icon: "📢" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <Shell brand="Smart Hostel" roleLabel="Student" userName={session?.name ?? "Student"} nav={nav}>
      {children}
    </Shell>
  );
}

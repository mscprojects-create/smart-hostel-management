import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Hostel Management System",
  description: "Centralized hostel management & grievance redressal portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

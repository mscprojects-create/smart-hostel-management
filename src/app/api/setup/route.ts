import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/**
 * One-time database seeding for production.
 *
 * Open  /api/setup?token=YOUR_SETUP_TOKEN  once after the first deploy to insert
 * the demo data (users, rooms, complaints, fees, mess menu). It refuses to run
 * again if data already exists, unless you add &force=1.
 *
 * Protect it by setting the SETUP_TOKEN environment variable in Vercel.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const force = url.searchParams.get("force") === "1";

  if (!process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "SETUP_TOKEN env var is not configured." }, { status: 500 });
  }
  if (token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 401 });
  }

  const existing = await db.user.count();
  if (existing > 0 && !force) {
    return NextResponse.json({ ok: true, message: "Database already has data. Add &force=1 to reseed." });
  }

  // Clear (respect FK order).
  await db.complaint.deleteMany();
  await db.leave.deleteMany();
  await db.fee.deleteMany();
  await db.notice.deleteMany();
  await db.messMenu.deleteMany();
  await db.user.deleteMany();
  await db.room.deleteMany();
  await db.hostel.deleteMany();

  const pw = (s: string) => bcrypt.hashSync(s, 10);

  const hostel = await db.hostel.create({ data: { name: "Aryabhatta Block", type: "BOYS" } });
  const room101 = await db.room.create({ data: { number: "101", floor: 1, capacity: 2, type: "DOUBLE", hostelId: hostel.id } });
  await db.room.create({ data: { number: "102", floor: 1, capacity: 1, type: "SINGLE", hostelId: hostel.id } });
  await db.room.create({ data: { number: "201", floor: 2, capacity: 4, type: "DORMITORY", hostelId: hostel.id } });

  await db.user.create({
    data: { name: "System Admin", email: "admin@hostel.edu", password: pw("admin123"), role: "ADMIN", status: "ACTIVE", phone: "9000000001" },
  });
  const warden = await db.user.create({
    data: { name: "Warden Sharma", email: "warden@hostel.edu", password: pw("warden123"), role: "WARDEN", status: "ACTIVE", phone: "9000000002" },
  });
  const rahul = await db.user.create({
    data: { name: "Rahul Verma", email: "rahul@hostel.edu", password: pw("student123"), role: "STUDENT", status: "ACTIVE", phone: "9000000003", course: "B.Tech CSE", year: 2, roomId: room101.id },
  });
  const amit = await db.user.create({
    data: { name: "Amit Singh", email: "amit@hostel.edu", password: pw("student123"), role: "STUDENT", status: "ACTIVE", phone: "9000000004", course: "B.Tech ECE", year: 2, roomId: room101.id },
  });
  await db.user.create({
    data: { name: "Priya Nair", email: "priya@hostel.edu", password: pw("student123"), role: "STUDENT", status: "PENDING", phone: "9000000005", course: "B.Sc Physics", year: 1 },
  });

  await db.complaint.createMany({
    data: [
      { title: "Wi-Fi not working", category: "Internet", description: "No internet in room 101 since morning.", status: "PENDING", studentId: rahul.id },
      { title: "Leaking tap in bathroom", category: "Plumbing", description: "The washbasin tap keeps dripping.", status: "IN_PROGRESS", studentId: amit.id },
      { title: "Tube light fused", category: "Electrical", description: "Study table light is not turning on.", status: "RESOLVED", studentId: rahul.id },
    ],
  });

  await db.leave.createMany({
    data: [
      { type: "LEAVE", reason: "Going home for the weekend", fromDate: new Date("2026-06-06"), toDate: new Date("2026-06-08"), status: "PENDING", studentId: rahul.id },
      { type: "OUTPASS", reason: "Doctor appointment", fromDate: new Date("2026-06-04"), toDate: new Date("2026-06-04"), status: "APPROVED", studentId: amit.id },
    ],
  });

  await db.fee.createMany({
    data: [
      { title: "Hostel Fee - Semester 1", amount: 45000, dueDate: new Date("2026-06-15"), paid: false, studentId: rahul.id },
      { title: "Mess Fee - June", amount: 4500, dueDate: new Date("2026-06-10"), paid: true, paidAt: new Date("2026-05-28"), studentId: rahul.id },
      { title: "Hostel Fee - Semester 1", amount: 45000, dueDate: new Date("2026-06-15"), paid: false, studentId: amit.id },
      { title: "Mess Fee - June", amount: 4500, dueDate: new Date("2026-06-10"), paid: false, studentId: amit.id },
    ],
  });

  await db.notice.createMany({
    data: [
      { title: "Water supply maintenance", body: "Water supply will be off on 5th June from 10 AM to 1 PM for tank cleaning.", postedById: warden.id },
      { title: "Hostel Day celebration", body: "Hostel Day will be celebrated on 20th June. Cultural events and dinner for all residents.", postedById: warden.id },
    ],
  });

  await db.messMenu.createMany({
    data: [
      { day: "MON", breakfast: "Poha, Tea", lunch: "Rice, Dal, Aloo Sabzi", snacks: "Samosa, Tea", dinner: "Roti, Paneer, Rice" },
      { day: "TUE", breakfast: "Idli, Sambar", lunch: "Rice, Rajma, Salad", snacks: "Biscuits, Coffee", dinner: "Roti, Mix Veg, Dal" },
      { day: "WED", breakfast: "Aloo Paratha, Curd", lunch: "Rice, Chole, Papad", snacks: "Pakora, Tea", dinner: "Roti, Egg Curry, Rice" },
      { day: "THU", breakfast: "Upma, Tea", lunch: "Rice, Sambar, Beans", snacks: "Bread Pakora, Tea", dinner: "Roti, Aloo Gobi, Dal" },
      { day: "FRI", breakfast: "Bread, Omelette", lunch: "Rice, Kadhi, Bhindi", snacks: "Vada Pav, Tea", dinner: "Roti, Chicken/Soya, Rice" },
      { day: "SAT", breakfast: "Dosa, Chutney", lunch: "Veg Biryani, Raita", snacks: "Maggi, Coffee", dinner: "Roti, Dal Makhani, Rice" },
      { day: "SUN", breakfast: "Chole Bhature", lunch: "Special Thali", snacks: "Ice Cream", dinner: "Fried Rice, Manchurian" },
    ],
  });

  return NextResponse.json({
    ok: true,
    message: "Seeded successfully.",
    logins: {
      admin: "admin@hostel.edu / admin123",
      warden: "warden@hostel.edu / warden123",
      student: "rahul@hostel.edu / student123",
    },
  });
}

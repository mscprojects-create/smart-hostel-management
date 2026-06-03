import { PrismaClient, Role, UserStatus, RoomType, ComplaintStatus, LeaveType, LeaveStatus, Weekday } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  // Order matters because of foreign keys.
  await prisma.complaint.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.messMenu.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hostel.deleteMany();

  const pw = (s: string) => bcrypt.hashSync(s, 10);

  console.log("Creating hostel + rooms...");
  const hostel = await prisma.hostel.create({
    data: { name: "Aryabhatta Block", type: "BOYS" },
  });

  const room101 = await prisma.room.create({
    data: { number: "101", floor: 1, capacity: 2, type: RoomType.DOUBLE, hostelId: hostel.id },
  });
  const room102 = await prisma.room.create({
    data: { number: "102", floor: 1, capacity: 1, type: RoomType.SINGLE, hostelId: hostel.id },
  });
  await prisma.room.create({
    data: { number: "201", floor: 2, capacity: 4, type: RoomType.DORMITORY, hostelId: hostel.id },
  });

  console.log("Creating users...");
  await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@hostel.edu",
      password: pw("admin123"),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      phone: "9000000001",
    },
  });

  await prisma.user.create({
    data: {
      name: "Warden Sharma",
      email: "warden@hostel.edu",
      password: pw("warden123"),
      role: Role.WARDEN,
      status: UserStatus.ACTIVE,
      phone: "9000000002",
    },
  });

  const rahul = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "rahul@hostel.edu",
      password: pw("student123"),
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
      phone: "9000000003",
      course: "B.Tech CSE",
      year: 2,
      roomId: room101.id,
    },
  });

  const amit = await prisma.user.create({
    data: {
      name: "Amit Singh",
      email: "amit@hostel.edu",
      password: pw("student123"),
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
      phone: "9000000004",
      course: "B.Tech ECE",
      year: 2,
      roomId: room101.id,
    },
  });

  // A pending student awaiting admin approval (shows up in the approvals queue).
  await prisma.user.create({
    data: {
      name: "Priya Nair",
      email: "priya@hostel.edu",
      password: pw("student123"),
      role: Role.STUDENT,
      status: UserStatus.PENDING,
      phone: "9000000005",
      course: "B.Sc Physics",
      year: 1,
    },
  });

  const warden = await prisma.user.findUniqueOrThrow({ where: { email: "warden@hostel.edu" } });

  console.log("Creating complaints, leaves, fees, notices, mess menu...");
  await prisma.complaint.createMany({
    data: [
      { title: "Wi-Fi not working", category: "Internet", description: "No internet in room 101 since morning.", status: ComplaintStatus.PENDING, studentId: rahul.id },
      { title: "Leaking tap in bathroom", category: "Plumbing", description: "The washbasin tap keeps dripping.", status: ComplaintStatus.IN_PROGRESS, studentId: amit.id },
      { title: "Tube light fused", category: "Electrical", description: "Study table light is not turning on.", status: ComplaintStatus.RESOLVED, studentId: rahul.id },
    ],
  });

  await prisma.leave.createMany({
    data: [
      { type: LeaveType.LEAVE, reason: "Going home for the weekend", fromDate: new Date("2026-06-06"), toDate: new Date("2026-06-08"), status: LeaveStatus.PENDING, studentId: rahul.id },
      { type: LeaveType.OUTPASS, reason: "Doctor appointment", fromDate: new Date("2026-06-04"), toDate: new Date("2026-06-04"), status: LeaveStatus.APPROVED, studentId: amit.id },
    ],
  });

  await prisma.fee.createMany({
    data: [
      { title: "Hostel Fee - Semester 1", amount: 45000, dueDate: new Date("2026-06-15"), paid: false, studentId: rahul.id },
      { title: "Mess Fee - June", amount: 4500, dueDate: new Date("2026-06-10"), paid: true, paidAt: new Date("2026-05-28"), studentId: rahul.id },
      { title: "Hostel Fee - Semester 1", amount: 45000, dueDate: new Date("2026-06-15"), paid: false, studentId: amit.id },
      { title: "Mess Fee - June", amount: 4500, dueDate: new Date("2026-06-10"), paid: false, studentId: amit.id },
    ],
  });

  await prisma.notice.createMany({
    data: [
      { title: "Water supply maintenance", body: "Water supply will be off on 5th June from 10 AM to 1 PM for tank cleaning.", postedById: warden.id },
      { title: "Hostel Day celebration", body: "Hostel Day will be celebrated on 20th June. Cultural events and dinner for all residents.", postedById: warden.id },
    ],
  });

  const menu: { day: Weekday; breakfast: string; lunch: string; snacks: string; dinner: string }[] = [
    { day: "MON", breakfast: "Poha, Tea", lunch: "Rice, Dal, Aloo Sabzi", snacks: "Samosa, Tea", dinner: "Roti, Paneer, Rice" },
    { day: "TUE", breakfast: "Idli, Sambar", lunch: "Rice, Rajma, Salad", snacks: "Biscuits, Coffee", dinner: "Roti, Mix Veg, Dal" },
    { day: "WED", breakfast: "Aloo Paratha, Curd", lunch: "Rice, Chole, Papad", snacks: "Pakora, Tea", dinner: "Roti, Egg Curry, Rice" },
    { day: "THU", breakfast: "Upma, Tea", lunch: "Rice, Sambar, Beans", snacks: "Bread Pakora, Tea", dinner: "Roti, Aloo Gobi, Dal" },
    { day: "FRI", breakfast: "Bread, Omelette", lunch: "Rice, Kadhi, Bhindi", snacks: "Vada Pav, Tea", dinner: "Roti, Chicken/Soya, Rice" },
    { day: "SAT", breakfast: "Dosa, Chutney", lunch: "Veg Biryani, Raita", snacks: "Maggi, Coffee", dinner: "Roti, Dal Makhani, Rice" },
    { day: "SUN", breakfast: "Chole Bhature", lunch: "Special Thali", snacks: "Ice Cream", dinner: "Fried Rice, Manchurian" },
  ];
  await prisma.messMenu.createMany({ data: menu });

  console.log("\nSeed complete! Demo logins:");
  console.log("  Admin    -> admin@hostel.edu  / admin123");
  console.log("  Warden   -> warden@hostel.edu / warden123");
  console.log("  Student  -> rahul@hostel.edu  / student123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

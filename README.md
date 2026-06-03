# 🏠 Smart Hostel Management & Grievance Redressal System

A centralized, web-based portal that digitalizes daily hostel operations — room
allocation, fee tracking, grievance redressal, leave/out-pass approvals, notices
and mess management — with **separate secure dashboards** for Admins, Wardens and
Students.

Built as a full-stack web app (frontend + backend + database in one project),
ready to push to **GitHub** and deploy on **Vercel**.

---

## ✨ Features by role

**Admin**
- Dashboard analytics: occupancy %, pending dues, open complaints, active students
- Hostel & room management (add / delete rooms, set capacity & type)
- Student approvals (approve / reject new registrations)
- **Automated room allocation** algorithm (one-click auto-assign)
- Fee management: generate invoices, mark paid/unpaid, track collection

**Warden**
- Grievance management: view complaints, update status (Pending → In Progress → Resolved), filter
- Leave & out-pass approval (approve / reject)
- Notice board: post announcements shown on every student dashboard

**Student**
- Dashboard: room, roommates, dues, tickets, today's mess, latest notices
- Helpdesk/ticketing: raise complaints with an optional photo link
- Digital leave / out-pass application with live status
- Fee breakdown + online "Pay now" (demo gateway)
- Weekly mess menu (today highlighted)
- Notice board

---

## 🧰 Tech stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | Next.js 14 (App Router) + React + Tailwind  |
| Backend     | Next.js Route Handlers (API)                |
| Database    | PostgreSQL via Prisma ORM                   |
| Auth        | JWT (jose) in HTTP-only cookies + bcrypt    |
| Access      | Role-based middleware (Admin/Warden/Student)|
| Hosting     | Vercel + Neon (serverless Postgres)         |

---

## 🚀 Run it locally

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org)
- A PostgreSQL database. The easiest free option is **[Neon](https://neon.tech)** —
  create a project and copy the connection string. (Works for local dev too.)

### 2. Install
```bash
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="any-long-random-string"
```
Generate a secret quickly:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create tables + seed demo data
```bash
npm run db:push     # creates the tables from the Prisma schema
npm run db:seed     # inserts demo users, rooms, complaints, fees, menu...
```

### 5. Start
```bash
npm run dev
```
Open **http://localhost:3000**

---

## 🔑 Demo logins

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Admin   | admin@hostel.edu    | admin123    |
| Warden  | warden@hostel.edu   | warden123   |
| Student | rahul@hostel.edu    | student123  |
| Student | amit@hostel.edu     | student123  |

There's also a pending student (`priya@hostel.edu`) waiting in the Admin → Approvals queue.
You can also register a brand-new student from the login page (it lands in the approval queue).

---

## ☁️ Deploy to Vercel + GitHub

### A. Push to GitHub
```bash
git init
git add .
git commit -m "Smart Hostel Management System"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

### B. Create the database (Neon)
1. Go to [neon.tech](https://neon.tech) → create a free project.
2. Copy the **connection string** (starts with `postgresql://...`).

### C. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo.
2. In **Environment Variables**, add:
   - `DATABASE_URL` → your Neon connection string
   - `JWT_SECRET` → a long random string
3. Click **Deploy**. (The build runs `prisma generate` automatically.)

### D. Initialise the production database
After the first deploy, push the schema and seed data once. From your machine,
temporarily point your local `.env` `DATABASE_URL` at the Neon URL and run:
```bash
npm run db:push
npm run db:seed
```
Then reload your Vercel URL and log in with the demo accounts. Done. 🎉

---

## 📁 Project structure
```
prisma/
  schema.prisma        # database models
  seed.ts              # demo data
src/
  middleware.ts        # role-based route protection
  lib/                 # db client, auth (JWT/bcrypt), guards
  components/          # Shell (sidebar) + shared UI
  app/
    login/             # login + register
    api/               # backend endpoints (auth, admin, warden, student)
    admin/             # admin dashboard + pages
    warden/            # warden dashboard + pages
    student/           # student dashboard + pages
```

---

## 🛠️ Useful scripts
| Command            | What it does                                    |
|--------------------|-------------------------------------------------|
| `npm run dev`      | Start dev server                                |
| `npm run build`    | Production build (`prisma generate` + `next build`) |
| `npm run db:push`  | Sync schema to the database                     |
| `npm run db:seed`  | Insert demo data                                |
| `npm run db:reset` | Wipe + recreate + reseed (⚠️ deletes data)      |

---

## 📌 Notes
- Payments are simulated (the "Pay now" button marks an invoice paid). To make it
  real, integrate Razorpay/Stripe in `src/app/api/student/fees/[id]/pay/route.ts`
  and only mark paid on a verified webhook.
- Photo uploads use a URL field for simplicity; swap in a file uploader (e.g.
  UploadThing / Cloudinary) if you want true uploads.

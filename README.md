# 🏫 Smart School Management System (ERP)

A complete, modern, enterprise-grade, responsive School Management & Academic ERP web application engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **SQLite / PostgreSQL**, **Lucide Icons**, and **Recharts**.

Designed like a commercial SaaS product with full light/dark mode support, role-based access control (RBAC) across 8 distinct institutional roles, responsive sidebar navigation, printable ID cards, report cards, fee receipts, and full CRUD workflows.

---

## 🌟 Key Highlights & Architecture

- **8 Multi-Role Dashboards & Permissions**:
  1. 👑 **Super Admin**: Complete institutional control, system parameters, security logs, and user identity management.
  2. 🏫 **School Admin**: Campus management, admissions, class scheduling, and academic staffing.
  3. 🎓 **Principal**: Academic excellence monitoring, teacher evaluation, examination schedules, and transcripts.
  4. 👩‍🏫 **Teacher**: Course routines, homework assignments, daily roll calls, and subject grading.
  5. 👨‍🎓 **Student**: Academic transcripts, GPA rankings, daily attendance percentage, homework submissions, and fee invoices.
  6. 👨‍👩‍👦 **Parent**: Child performance tracking, teacher communication, and online fee payment.
  7. 💼 **Accountant**: Tuition fee invoicing, partial & full payment receipts, and operational expenses ledger.
  8. 📚 **Librarian**: Book cataloging, ISBN indexing, loan circulation, and return desk.

- **Instant 1-Click Role Switcher**:
  Convenient demo role switcher located in the top navbar allows evaluators and administrators to instantly experience the dashboard from any of the 8 distinct role viewpoints without needing to log out and re-enter credentials.

- **High-Fidelity Printable Documents**:
  - 🪪 **Printable Student ID Card**: Complete with official school header, photo, barcode, admission number, validity date, and principal signature.
  - 📑 **Printable Academic Report Card**: Official transcript with school seal, subject marks breakdown, letter grade, GPA, and class teacher signature.
  - 🧾 **Printable Fee Receipt**: Official cashier payment receipt with transaction ID, payment method, paid amount, remaining balance, and cashier seal.

---

## 🚀 Complete Feature Modules

| Module | Features Included |
| :--- | :--- |
| **Executive Dashboard** | Real-time KPI statistics (Total Students, Teachers, Revenue, Outstanding Fees), 6-Month Income vs Expenditure Area Chart, Weekly Attendance Bar Chart, Recent Payments, and Campus Bulletins. |
| **Student Management** | Student registry with search, class filtering, admission modal, profile view, record editing, soft/hard deletion, CSV export, and printable ID Card. |
| **Teacher Management** | Faculty directory, designation, departments, salary tracking, course assignments, add faculty modal, and contact ledger. |
| **Classes & Sections** | Grade level matrix, section rooms, student capacities vs enrolled counts, and designated class teachers. |
| **Attendance Management**| Daily roll call with 1-click status (Present, Absent, Late, Excused), "Mark All Present" shortcut, database persistence, and attendance ratio statistics. |
| **Examination & Results**| Term exam routines, date windows, exam halls, marks recording with automatic letter grade (A+, A, B...) and GPA calculation, plus official printable report cards. |
| **Fees & Accounts** | Automated invoice generation, partial and full payment recording (Cash, Card, Bank Wire, Online), printable receipt generation, and institutional expense tracker. |
| **Timetable Routine** | 5-day class schedule matrix (Monday-Friday) by period, teacher, subject, and room allocation. |
| **Homework Management**| Problem sets, submission tracking, teacher review, and grading feedback. |
| **Library Management** | Book catalog by ISBN, category, shelf location, total vs available copies, issue book to student, and return book with fine computation. |
| **Transport Fleet** | Vehicle fleet inventory, driver credentials, route start/end points, and bus pickup timings. |
| **Staff & HR** | Support staff registry, salary compensation, department categorization, and employee onboarding. |
| **Notice Board** | Campus bulletin board with audience filtering (All, Faculty, Students, Parents) and pinned alerts. |
| **Analytics Reports** | Exportable reports (Enrollment Matrix, Academic Merit GPA, and Financial Ledger) with 1-click CSV download and print styling. |
| **System Settings** | School name, official contact info, tagline, academic session period, and currency symbol. |
| **Security & RBAC** | BCrypt password hashing, JWT HTTP-Only session cookies, protected Next.js middleware, and server-side authorization. |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React Icons, Recharts
- **Backend**: Next.js App Router Server Routes & Server Actions
- **Database**: Prisma ORM with SQLite (Out-of-the-box local run) & PostgreSQL / Supabase ready
- **Authentication**: JWT (`jose`), BCrypt password hashing, secure HTTP-Only cookies
- **Styling**: Tailwind CSS with dark mode class strategy and print media stylesheets

---

## 📦 Local Installation Guide

### Prerequisites
- **Node.js** v18+ or v20+ (Node.js v26 LTS tested)
- **Git**

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone <REPO_URL>
   cd School
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` (a ready-to-run `.env` is already configured for instant local execution):
   ```bash
   cp .env.example .env
   ```

4. **Initialize and Seed Database**:
   Run the Prisma push and realistic seed script:
   ```bash
   npm run db:reset
   # Or manually:
   npx prisma db push
   node prisma/seed.js
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials (For Testing & Development)

The application comes pre-loaded with realistic sample data and accounts for all 8 roles. You can log in with the credentials below, or click any of the **Quick Demo Role buttons** on the login page or top navbar:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@smartacademy.edu` | `Admin@123` | Full Master Control |
| **School Admin** | `schooladmin@smartacademy.edu` | `Admin@123` | Campus & Operations |
| **Principal** | `principal@smartacademy.edu` | `Password@123` | Academics & Faculty |
| **Teacher** | `teacher@smartacademy.edu` | `Password@123` | Grades & Attendance |
| **Student** | `student@smartacademy.edu` | `Password@123` | Transcripts & Invoices |
| **Parent** | `parent@smartacademy.edu` | `Password@123` | Child Monitoring |
| **Accountant** | `accountant@smartacademy.edu` | `Password@123` | Billing & Expenses |
| **Librarian** | `librarian@smartacademy.edu` | `Password@123` | Library Circulation |

---

## 🗄️ Database Setup Guide (Switching to PostgreSQL / Supabase)

To connect to a hosted PostgreSQL instance or Supabase database:

1. In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. In your `.env` file, supply your PostgreSQL / Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
   ```

3. Push the schema and seed the database:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

---

## ☁️ Production Deployment Guide (Vercel / Cloud)

### Deploy to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and import the repository.
3. In **Environment Variables**, configure:
   - `DATABASE_URL`: Your hosted PostgreSQL or Supabase connection string.
   - `JWT_SECRET`: A secure random 64-character secret.
   - `NEXT_PUBLIC_APP_NAME`: `Smart School Management System`
4. Deploy! Vercel will automatically build and serve the application globally with edge caching.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).

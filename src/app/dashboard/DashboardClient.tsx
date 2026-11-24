'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string | null;
  };
  stats: any;
}

const monthlyFinancialData = [
  { month: 'Jun', income: 18500, expenses: 11200 },
  { month: 'Jul', income: 21200, expenses: 12400 },
  { month: 'Aug', income: 24500, expenses: 13800 },
  { month: 'Sep', income: 29000, expenses: 14500 },
  { month: 'Oct', income: 32400, expenses: 15200 },
  { month: 'Nov', income: 35800, expenses: 16100 },
];

const attendanceWeeklyData = [
  { day: 'Mon', attendance: 96 },
  { day: 'Tue', attendance: 94 },
  { day: 'Wed', attendance: 98 },
  { day: 'Thu', attendance: 95 },
  { day: 'Fri', attendance: 92 },
];

const gradeDistribution = [
  { name: 'Grade A+ (90-100)', count: 28, color: '#4f46e5' },
  { name: 'Grade A (80-89)', count: 42, color: '#06b6d4' },
  { name: 'Grade B (70-79)', count: 24, color: '#10b981' },
  { name: 'Grade C (60-69)', count: 12, color: '#f59e0b' },
  { name: 'Grade D/F (<60)', count: 4, color: '#ef4444' },
];

export default function DashboardClient({ user, stats }: DashboardClientProps) {
  const isSuperOrAdmin =
    user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN' || user.role === 'PRINCIPAL';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Academic Term 2026-2027 • Live Session
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-xl">
              {user.role === 'SUPER_ADMIN' && 'Here is your central operational overview of institutional metrics, enrollment, and finances.'}
              {user.role === 'SCHOOL_ADMIN' && 'Manage campus operations, department assignments, student records, and billing.'}
              {user.role === 'PRINCIPAL' && 'Monitor campus attendance, examination merit lists, and faculty department routines.'}
              {user.role === 'TEACHER' && 'Track your teaching timetable, assign homework, and review student grades.'}
              {user.role === 'STUDENT' && 'View your academic reports, weekly routine, pending assignments, and fee statements.'}
              {user.role === 'PARENT' && 'Review your child’s academic performance, daily attendance, and tuition payments.'}
              {user.role === 'ACCOUNTANT' && 'Manage fee collection receipts, outstanding dues, and institutional expenses.'}
              {user.role === 'LIBRARIAN' && 'Monitor library catalog circulation, active book issues, and returns.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSuperOrAdmin && (
              <Link
                href="/students"
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Add Student
              </Link>
            )}
            {(user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN' || user.role === 'TEACHER') && (
              <Link
                href="/attendance"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-xs text-white transition-all backdrop-blur-sm flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Mark Attendance
              </Link>
            )}
            {user.role === 'STUDENT' && (
              <Link
                href="/exams"
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                View Report Card
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats.studentCount.toString()}
          change="+12% this term"
          isPositive={true}
          icon={GraduationCap}
          color="indigo"
          subtitle="Enrolled across Grades 8-12"
        />
        <StatCard
          title="Active Faculty"
          value={stats.teacherCount.toString()}
          change="Full Capacity"
          isPositive={true}
          icon={Users}
          color="purple"
          subtitle="All academic departments"
        />
        <StatCard
          title="Revenue Collected"
          value={formatCurrency(stats.totalRevenue)}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
          subtitle="Tuition & registration fees"
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(stats.totalPendingFees)}
          change="Due this month"
          isPositive={false}
          icon={CreditCard}
          color="rose"
          subtitle="Invoices pending payment"
        />
      </div>

      {/* Role Specific Section: STUDENT View */}
      {user.role === 'STUDENT' && stats.studentDetails && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Academic Profile: {stats.studentDetails.firstName} {stats.studentDetails.lastName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Roll No: <span className="font-semibold text-indigo-600">{stats.studentDetails.rollNumber}</span> • Class:{' '}
                <span className="font-semibold">{stats.studentDetails.class.name}</span> (Section {stats.studentDetails.section.name})
              </p>
            </div>
            <Link
              href={`/students/${stats.studentDetails.id}`}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 self-start"
            >
              <FileText className="w-4 h-4" />
              Download Student ID Card
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Term GPA</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">3.92 / 4.0</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Rank #1 in Class</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance Ratio</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">96.8%</p>
              <span className="text-[11px] text-slate-500 font-medium">Regular & On-Time</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Books Borrowed</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {stats.studentDetails.bookIssues?.length || 0}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Calculus: Early Transcendentals</span>
            </div>
          </div>
        </div>
      )}

      {/* Role Specific Section: TEACHER View */}
      {user.role === 'TEACHER' && stats.teacherDetails && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Faculty Teaching Schedule & Department
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Department</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {stats.teacherDetails.department}
              </p>
              <p className="text-xs text-indigo-600 mt-1">{stats.teacherDetails.designation}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Assigned Class In-charge</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">Grade 10 - Section A</p>
              <p className="text-xs text-slate-500 mt-1">45 Registered Students</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Next Lecture Today</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">08:30 AM - Room 1001</p>
              <p className="text-xs text-emerald-600 mt-1">Advanced Mathematics</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section: Financial Growth & Weekly Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Income & Expenditure
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fiscal trajectory over past 6 months (in BDT)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinancialData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis
                  tickLine={false}
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(val) => `৳${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Attendance %
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              School-wide average presence by day
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis domain={[80, 100]} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="attendance" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Average Presence</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">95.0% Target Met</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions, Notice Board & Class Capacities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Fee Payments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Payment Collections
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time verified tuition transactions
              </p>
            </div>
            <Link
              href="/fees"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2 overflow-x-auto">
            {stats.recentPayments && stats.recentPayments.length > 0 ? (
              stats.recentPayments.map((p: any) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {p.invoice?.student?.firstName} {p.invoice?.student?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.receiptNumber} • {p.invoice?.feeType?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      +{formatCurrency(p.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400">{formatDate(p.paymentDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No payment records found.</div>
            )}
          </div>
        </div>

        {/* Notice Board Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notice Board</h3>
              <Link
                href="/notices"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              {stats.recentNotices && stats.recentNotices.length > 0 ? (
                stats.recentNotices.map((notice: any) => (
                  <div
                    key={notice.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase">
                        {notice.targetAudience}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(notice.createdAt)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {notice.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {notice.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">No active notices.</div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/notices"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold text-center block transition-colors"
            >
              Publish New Announcement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  Calendar,
  Award,
  CreditCard,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  School,
  QrCode,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface StudentDetailClientProps {
  user: { role: Role };
  student: any;
  settings: any;
}

export default function StudentDetailClient({
  user,
  student,
  settings,
}: StudentDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'idcard' | 'academics' | 'fees'>('overview');

  const handlePrintID = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Back and Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/students"
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student ID: <span className="font-semibold text-indigo-600">{student.studentId}</span> • Class {student.class?.name} (Sec {student.section?.name})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintID}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print Student ID Card
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          General Profile
        </button>
        <button
          onClick={() => setActiveTab('idcard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'idcard'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Official ID Card
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'academics'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Exam Records & Grades
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fees'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Fee Statements
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          {/* Left: Bio card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
            <img
              src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={student.firstName}
              className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20 shadow-lg"
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-xs text-indigo-600 font-semibold">{student.studentId}</p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Roll Number:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">#{student.rollNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Class & Sec:</span>
                <span className="font-semibold">{student.class?.name} - {student.section?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admission No:</span>
                <span className="font-semibold">{student.admissionNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admission Date:</span>
                <span className="font-semibold">{formatDate(student.admissionDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-semibold">{formatDate(student.dob)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-bold text-rose-600">{student.bloodGroup || 'O+'}</span>
              </div>
            </div>
          </div>

          {/* Right: Parent & Contact Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Parent & Guardian Information
              </h3>
              {student.parent ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400">Father / Guardian</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{student.parent.fatherName}</p>
                    <p className="text-slate-500 mt-0.5">{student.parent.occupation || 'Professional'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400">Emergency Phone</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{student.parent.phone}</p>
                    <p className="text-slate-500 mt-0.5">{student.parent.email || '—'}</p>
                  </div>
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400">Residential Address</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{student.address || student.parent.address || 'Springfield Metro Area'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No guardian registered yet.</p>
              )}
            </div>

            {/* Recent Attendance */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Recent Attendance History
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {student.attendances?.slice(0, 5).map((att: any) => (
                  <div key={att.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-400 block">{formatDate(att.date)}</span>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        att.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : att.status === 'LATE'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: High Fidelity Printable Student ID Card */}
      {(activeTab === 'idcard' || typeof window !== 'undefined') && (
        <div className={`printable-area flex justify-center py-6 ${activeTab !== 'idcard' ? 'hidden' : 'block'}`}>
          <div className="w-[380px] bg-white rounded-3xl border-2 border-indigo-600 shadow-2xl overflow-hidden text-slate-900 font-sans">
            {/* ID Card Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-5 text-white text-center relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-1">
                <School className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-extrabold text-sm tracking-wider uppercase">
                {settings?.schoolName || 'Smart Academy International'}
              </h3>
              <p className="text-[10px] text-indigo-200 tracking-widest uppercase">Official Student Identity Card</p>
            </div>

            {/* ID Card Body */}
            <div className="p-6 text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={student.firstName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-600/30 shadow-md mx-auto"
                />
                <span className="absolute -bottom-2 -right-2 p-1 rounded-full bg-emerald-500 text-white ring-2 ring-white">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">
                  {student.firstName} {student.lastName}
                </h4>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">
                  Class: {student.class?.name} • Sec {student.section?.name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 grid grid-cols-2 gap-2 text-left text-xs border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Student ID</span>
                  <span className="font-black text-slate-800">{student.studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Roll No</span>
                  <span className="font-black text-slate-800">#{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Blood Group</span>
                  <span className="font-bold text-rose-600">{student.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Valid Thru</span>
                  <span className="font-bold text-slate-800">July 2027</span>
                </div>
              </div>

              {/* Barcode & Signature */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-left">
                  <div className="h-6 w-28 bg-slate-800 flex items-center justify-center text-[9px] font-mono text-white tracking-widest rounded">
                    |||||| | ||||| | ||
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">{student.admissionNumber}</span>
                </div>
                <div className="text-center">
                  <span className="block font-serif italic text-xs text-slate-600">A. Pendelton</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 block border-t border-slate-300 pt-0.5">
                    Principal Signature
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Academics & Results */}
      {activeTab === 'academics' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm no-print space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Exam Performance & Subject Marks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Examination</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Marks Obtained</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {student.examResults?.length > 0 ? (
                  student.examResults.map((r: any) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{r.exam?.title}</td>
                      <td className="py-3 px-4 text-indigo-600 font-semibold">{r.subject?.name}</td>
                      <td className="py-3 px-4 font-black">{r.marksObtained} / {r.maxMarks}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold">
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">{r.gpa.toFixed(1)}</td>
                      <td className="py-3 px-4 text-slate-500">{r.remarks || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No examination marks registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fees */}
      {activeTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm no-print space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Fee Invoices & Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Fee Category</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Due</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {student.feeInvoices?.length > 0 ? (
                  student.feeInvoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-4 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-semibold">{inv.feeType?.name}</td>
                      <td className="py-3 px-4 font-bold">{formatCurrency(inv.amount)}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">{formatCurrency(inv.paidAmount)}</td>
                      <td className="py-3 px-4 text-rose-500 font-bold">{formatCurrency(inv.dueAmount)}</td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(inv.dueDate)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

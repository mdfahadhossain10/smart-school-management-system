'use client';

import React, { useState } from 'react';
import { FileBarChart2, Download, Printer, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface ReportsClientProps {
  user: { role: Role };
  classes: any[];
  results: any[];
  invoices: any[];
  expenses: any[];
}

export default function ReportsClient({
  user,
  classes,
  results,
  invoices,
  expenses,
}: ReportsClientProps) {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'enrollment' | 'academics' | 'financial'>('enrollment');

  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const exportCSV = (data: any[], headers: string[], filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...data.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Report exported: ${filename}.csv`);
  };

  const handleExportEnrollment = () => {
    const headers = ['Class Name', 'Grade Level', 'Capacity', 'Enrolled Count', 'Class Teacher'];
    const rows = classes.map((c) => [
      c.name,
      c.numericGrade,
      c.capacity,
      c.students?.length || 0,
      c.classTeacher ? `${c.classTeacher.firstName} ${c.classTeacher.lastName}` : 'Unassigned',
    ]);
    exportCSV(rows, headers, 'Enrollment_Report');
  };

  const handleExportAcademics = () => {
    const headers = ['Student Name', 'Roll No', 'Class', 'Subject', 'Score', 'Grade', 'GPA'];
    const rows = results.map((r) => [
      `${r.student?.firstName} ${r.student?.lastName}`,
      r.student?.rollNumber,
      r.student?.class?.name,
      r.subject?.name,
      r.marksObtained,
      r.grade,
      r.gpa,
    ]);
    exportCSV(rows, headers, 'Academic_Merit_Report');
  };

  const handleExportFinance = () => {
    const headers = ['Invoice No', 'Student', 'Fee Category', 'Total Amount', 'Paid Amount', 'Due Balance', 'Status'];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      `${inv.student?.firstName} ${inv.student?.lastName}`,
      inv.feeType?.name,
      inv.amount,
      inv.paidAmount,
      inv.dueAmount,
      inv.status,
    ]);
    exportCSV(rows, headers, 'Financial_Ledger_Report');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileBarChart2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Institutional Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official enrollment ledgers, merit performance ranks, and financial statements
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
        >
          <Printer className="w-4 h-4" />
          Print Formal Summary
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        <button
          onClick={() => setActiveTab('enrollment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'enrollment'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Student Enrollment Matrix
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'academics'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Academic Merit & Grades
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'financial'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Financial Treasury Statement
        </button>
      </div>

      {/* Tab 1: Enrollment Matrix */}
      {activeTab === 'enrollment' && (
        <div className="space-y-4">
          <div className="flex justify-end no-print">
            <button
              onClick={handleExportEnrollment}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Class Teacher</th>
                    <th className="py-3 px-4">Sections</th>
                    <th className="py-3 px-4">Enrolled Count</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4 text-right">Capacity Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classes.map((c) => {
                    const count = c.students?.length || 0;
                    const percent = Math.round((count / c.capacity) * 100);

                    return (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {c.classTeacher ? `${c.classTeacher.firstName} ${c.classTeacher.lastName}` : 'Unassigned'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-600">
                          {c.sections?.map((s: any) => s.name).join(', ')}
                        </td>
                        <td className="py-3 px-4 font-black">{count} Students</td>
                        <td className="py-3 px-4 text-slate-500">{c.capacity}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-emerald-600">{percent}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Academic Merit */}
      {activeTab === 'academics' && (
        <div className="space-y-4">
          <div className="flex justify-end no-print">
            <button
              onClick={handleExportAcademics}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4">Letter Grade</th>
                    <th className="py-3 px-4 text-right">GPA Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {r.student?.firstName} {r.student?.lastName} (#{r.student?.rollNumber})
                      </td>
                      <td className="py-3 px-4 text-slate-500">{r.student?.class?.name}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">{r.subject?.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{r.exam?.title}</td>
                      <td className="py-3 px-4 font-bold">{r.marksObtained} / {r.maxMarks}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs">
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                        {r.gpa.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Financial Treasury */}
      {activeTab === 'financial' && (
        <div className="space-y-4">
          <div className="flex justify-end no-print">
            <button
              onClick={handleExportFinance}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs text-slate-500">Total Collected</span>
              <p className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-xs text-slate-500">Total Due Dues</span>
              <p className="text-xl font-black text-rose-600 mt-1">{formatCurrency(totalDue)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="text-xs text-slate-500">Total Outflow Expenses</span>
              <p className="text-xl font-black text-indigo-600 mt-1">{formatCurrency(totalExpense)}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Billed Amount</th>
                    <th className="py-3 px-4">Paid Amount</th>
                    <th className="py-3 px-4">Due Balance</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-4 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {inv.student?.firstName} {inv.student?.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{inv.feeType?.name}</td>
                      <td className="py-3 px-4 font-bold">{formatCurrency(inv.amount)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{formatCurrency(inv.paidAmount)}</td>
                      <td className="py-3 px-4 font-bold text-rose-500">{formatCurrency(inv.dueAmount)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

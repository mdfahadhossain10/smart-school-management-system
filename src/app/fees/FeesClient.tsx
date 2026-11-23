'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  DollarSign,
  Receipt,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  School,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface FeesClientProps {
  user: { role: Role; name: string };
  initialInvoices: any[];
  feeTypes: any[];
  students: any[];
  initialExpenses: any[];
  settings: any;
}

export default function FeesClient({
  user,
  initialInvoices,
  feeTypes,
  students,
  initialExpenses,
  settings,
}: FeesClientProps) {
  const { success, error } = useToast();
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [expenses, setExpenses] = useState<any[]>(initialExpenses);
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses' | 'receipt'>('invoices');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<any>(
    initialInvoices.flatMap((i) => i.payments)[0] || null
  );

  // Forms
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: students[0]?.id || '',
    feeTypeId: feeTypes[0]?.id || '',
    amount: feeTypes[0]?.amount?.toString() || '450',
    discountAmount: '0',
    dueDate: '2026-12-05',
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'ONLINE',
    transactionId: '',
    notes: 'Online student fee settlement',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'IT & Infrastructure',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    description: '',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(user.role);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.student?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      inv.student?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      inv.student?.rollNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);
  const totalExpenseAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fees/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate invoice');

      setInvoices((prev) => [data.invoice, ...prev]);
      setIsInvoiceModalOpen(false);
      success(`Invoice ${data.invoice.invoiceNumber} created for ${data.invoice.student?.firstName}`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleOpenPayment = (inv: any) => {
    setSelectedInvoiceForPayment(inv);
    setPaymentForm({
      amount: inv.dueAmount.toString(),
      paymentMethod: 'ONLINE',
      transactionId: `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes: `Fee payment for ${inv.feeType?.name}`,
    });
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fees/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPayment.id,
          ...paymentForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record payment');

      setInvoices((prev) =>
        prev.map((i) => (i.id === selectedInvoiceForPayment.id ? data.invoice : i))
      );
      setSelectedPaymentForReceipt({
        ...data.payment,
        invoice: data.invoice,
      });
      setIsPaymentModalOpen(false);
      setActiveTab('receipt');
      success(`Payment receipt ${data.payment.receiptNumber} registered!`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record expense');

      setExpenses((prev) => [data.expense, ...prev]);
      setIsExpenseModalOpen(false);
      success(`Expense "${data.expense.title}" recorded.`);
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Fees, Billing & Treasury
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Student fee collection, automated invoicing, receipts, and institutional expenses
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              Log Expense
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Generate Fee Invoice
            </button>
          </div>
        )}
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Collected Fees</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalCollected)}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Outstanding Unpaid</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalOutstanding)}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Operational Expenses</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{formatCurrency(totalExpenseAmount)}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Fee Invoices & Dues
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Expense Register
        </button>
        <button
          onClick={() => setActiveTab('receipt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'receipt'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Printable Fee Receipt
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4 no-print">
          {/* Search & Filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll number, invoice #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Fee Category</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Due Balance</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {inv.student?.firstName} {inv.student?.lastName}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          #{inv.student?.rollNumber} • {inv.student?.class?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">{inv.feeType?.name}</td>
                      <td className="py-3 px-4 font-bold">{formatCurrency(inv.amount)}</td>
                      <td className="py-3 px-4 text-slate-500">-{formatCurrency(inv.discountAmount)}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">{formatCurrency(inv.paidAmount)}</td>
                      <td className="py-3 px-4 text-rose-500 font-bold">{formatCurrency(inv.dueAmount)}</td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(inv.dueDate)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                              : inv.status === 'PARTIAL'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.status !== 'PAID' ? (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            Pay Fee
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPaymentForReceipt({
                                ...(inv.payments?.[0] || {}),
                                invoice: inv,
                              });
                              setActiveTab('receipt');
                            }}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden no-print space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional Expenses & Outflows</h3>
              <p className="text-xs text-slate-500">Track operations, laboratory consumables, infrastructure, and maintenance</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Title / Expense Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Authorized By</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{exp.receiptNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{exp.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{exp.paymentMethod}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(exp.date)}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{exp.recordedBy}</td>
                    <td className="py-3 px-4 text-right font-black text-rose-500">
                      -{formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: High Fidelity Printable Fee Receipt */}
      {activeTab === 'receipt' && selectedPaymentForReceipt && (
        <div className="space-y-6">
          <div className="flex justify-end no-print">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Official Fee Receipt
            </button>
          </div>

          {/* Printable Receipt Paper */}
          <div className="printable-area bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-2 border-slate-200 shadow-2xl max-w-2xl mx-auto font-sans">
            <div className="text-center pb-6 border-b-2 border-indigo-600">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white mx-auto flex items-center justify-center mb-2">
                <School className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-wider text-indigo-950">
                {settings?.schoolName || 'Smart Academy International'}
              </h2>
              <p className="text-[11px] text-slate-500">{settings?.address}</p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 uppercase">
                Official Tuition Payment Receipt
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt Number</span>
                <span className="font-black text-indigo-600 text-sm">{selectedPaymentForReceipt.receiptNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Date</span>
                <span className="font-bold text-slate-800">{formatDate(selectedPaymentForReceipt.paymentDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900">
                  {selectedPaymentForReceipt.invoice?.student?.firstName}{' '}
                  {selectedPaymentForReceipt.invoice?.student?.lastName}
                </span>
                <span className="block text-[10px] text-slate-400">
                  Roll #{selectedPaymentForReceipt.invoice?.student?.rollNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoice Reference</span>
                <span className="font-bold text-slate-800">{selectedPaymentForReceipt.invoice?.invoiceNumber}</span>
              </div>
            </div>

            <div className="py-6">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3">Transaction ID</th>
                    <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {selectedPaymentForReceipt.invoice?.feeType?.name || 'Tuition Fee'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600">
                      {selectedPaymentForReceipt.paymentMethod}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {selectedPaymentForReceipt.transactionId || 'CASH-SETTLED'}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600 text-sm">
                      {formatCurrency(selectedPaymentForReceipt.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Remaining Invoice Due Balance:</span>
                <span className="font-bold text-rose-600">
                  {formatCurrency(selectedPaymentForReceipt.invoice?.dueAmount || 0)}
                </span>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="block font-bold text-slate-800">{selectedPaymentForReceipt.receivedBy || 'Franklin Hayes'}</span>
                <span className="block border-t border-slate-300 pt-1 text-[10px] uppercase font-semibold text-slate-400">
                  Authorized Bursar / Cashier
                </span>
              </div>
              <div className="w-20 h-20 rounded-full border-2 border-emerald-500/40 flex items-center justify-center text-[9px] font-black uppercase text-emerald-600/60 rotate-[-15deg]">
                VERIFIED PAID
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Student Fee Invoice"
        subtitle="Issue an invoice to a student account"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              value={invoiceForm.studentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.rollNumber} - {s.firstName} {s.lastName} ({s.class?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fee Category *
              </label>
              <select
                value={invoiceForm.feeTypeId}
                onChange={(e) => {
                  const ft = feeTypes.find((f) => f.id === e.target.value);
                  setInvoiceForm({
                    ...invoiceForm,
                    feeTypeId: e.target.value,
                    amount: ft?.amount?.toString() || invoiceForm.amount,
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {feeTypes.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (${f.amount})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Amount ($)
              </label>
              <input
                type="number"
                required
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount / Scholarship ($)
              </label>
              <input
                type="number"
                value={invoiceForm.discountAmount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, discountAmount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Fee Payment"
        subtitle={`Settle balance for ${selectedInvoiceForPayment?.invoiceNumber}`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Student:</span>
              <span className="font-bold">
                {selectedInvoiceForPayment?.student?.firstName} {selectedInvoiceForPayment?.student?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Due Balance:</span>
              <span className="font-bold text-rose-500">{formatCurrency(selectedInvoiceForPayment?.dueAmount || 0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Amount ($) *
              </label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="ONLINE">Online Portal</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="CASH">Cash at Desk</option>
                <option value="BANK_TRANSFER">Bank Wire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction ID / Reference
            </label>
            <input
              type="text"
              value={paymentForm.transactionId}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Confirm Payment & Generate Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Record Operational Outflow"
        subtitle="Log campus maintenance, laboratory, and operational expense"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expense Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Lab Microscope Maintenance"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="IT & Infrastructure">IT & Infrastructure</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Sports">Sports</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Record Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

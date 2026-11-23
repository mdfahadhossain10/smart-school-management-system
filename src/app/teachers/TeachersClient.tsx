'use client';

import React, { useState } from 'react';
import { Users2, Plus, Search, Filter, Mail, Phone, Trash2, BookOpen, DollarSign } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface TeachersClientProps {
  user: { role: Role };
  initialTeachers: any[];
}

export default function TeachersClient({ user, initialTeachers }: TeachersClientProps) {
  const { success, error } = useToast();
  const [teachers, setTeachers] = useState<any[]>(initialTeachers);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    email: '',
    phone: '',
    department: 'Mathematics',
    designation: 'Senior Lecturer',
    qualification: 'M.Sc. Mathematics',
    salary: '5500',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  const departments = ['Mathematics', 'Science', 'Humanities', 'Computer Science', 'Languages'];

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.firstName.toLowerCase().includes(search.toLowerCase()) ||
      t.lastName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || t.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add teacher');

      setTeachers((prev) => [data.teacher, ...prev]);
      setIsAddModalOpen(false);
      success(`${data.teacher.firstName} ${data.teacher.lastName} enrolled as faculty.`);
      setFormData({
        firstName: '',
        lastName: '',
        gender: 'Female',
        email: '',
        phone: '',
        department: 'Mathematics',
        designation: 'Senior Lecturer',
        qualification: 'M.Sc. Mathematics',
        salary: '5500',
      });
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete teacher');
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      success('Faculty record removed successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Teacher Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Faculty directory, assigned departments, courses, and compensation
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Add Faculty Member
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teachers by name, email, department, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Teachers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                    alt={t.firstName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t.firstName} {t.lastName}
                    </h3>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      {t.designation}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">{t.teacherId}</span>
                  </div>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDelete(t.id, `${t.firstName} ${t.lastName}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{t.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Qualification:</span>
                  <span className="font-semibold">{t.qualification}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monthly Salary:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(t.salary)}</span>
                </div>
              </div>

              {/* Class teacher or assigned subject */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Assigned In-charge
                </span>
                {t.managedClasses?.length > 0 ? (
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Class Teacher: {t.managedClasses[0].name}
                  </span>
                ) : (
                  <span className="text-slate-500">Subject Specialist</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {t.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {t.phone}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Member"
        subtitle="Register new teacher into academic staff"
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Salary ($)
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Enroll Faculty Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

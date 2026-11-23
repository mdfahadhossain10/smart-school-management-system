'use client';

import React, { useState } from 'react';
import { School, Plus, Users, DoorOpen, UserCheck, Shield } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Role } from '@/lib/auth';

interface ClassesClientProps {
  user: { role: Role };
  initialClasses: any[];
  teachers: any[];
}

export default function ClassesClient({
  user,
  initialClasses,
  teachers,
}: ClassesClientProps) {
  const { success, error } = useToast();
  const [classes, setClasses] = useState<any[]>(initialClasses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Grade 7',
    numericGrade: '7',
    capacity: '40',
    classTeacherId: teachers[0]?.id || '',
    sections: 'A, B',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sectionNames = formData.sections.split(',').map((s) => s.trim());
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sectionNames,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create class');

      setClasses((prev) => [...prev, data.class]);
      setIsAddModalOpen(false);
      success(`${data.class.name} and sections created successfully!`);
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
            <School className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Class & Section Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Academic structure, room allocations, section capacities, and designated class teachers
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Create New Class
          </button>
        )}
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase">
                  Grade Level {c.numericGrade}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{c.name}</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 font-bold">
                <School className="w-5 h-5" />
              </div>
            </div>

            {/* In-Charge Teacher */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Class Teacher</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {c.classTeacher ? `${c.classTeacher.firstName} ${c.classTeacher.lastName}` : 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Sections Pills */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Active Sections & Rooms
              </span>
              <div className="grid grid-cols-2 gap-2">
                {c.sections?.map((sec: any) => (
                  <div
                    key={sec.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Section {sec.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{sec.roomNumber || 'Main Building'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Enrolled Students
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {c._count?.students || 0} / {c.capacity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Academic Class"
        subtitle="Establish a new grade level and sections"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class Display Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grade 7"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Numeric Grade
              </label>
              <input
                type="number"
                required
                value={formData.numericGrade}
                onChange={(e) => setFormData({ ...formData, numericGrade: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Capacity
              </label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Designate Class Teacher
            </label>
            <select
              value={formData.classTeacherId}
              onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            >
              <option value="">Select Faculty Member</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sections (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="A, B, C"
              value={formData.sections}
              onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
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
              Create Class & Sections
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

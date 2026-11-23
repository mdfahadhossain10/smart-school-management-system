'use client';

import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, MapPin, User, School, Filter } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Role } from '@/lib/auth';

interface TimetableClientProps {
  user: { role: Role };
  classes: any[];
  teachers: any[];
  initialTimetables: any[];
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function TimetableClient({
  user,
  classes,
  teachers,
  initialTimetables,
}: TimetableClientProps) {
  const { success, error } = useToast();
  const [timetables, setTimetables] = useState<any[]>(initialTimetables);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [slotForm, setSlotForm] = useState({
    classId: classes[0]?.id || '',
    sectionId: classes[0]?.sections[0]?.id || '',
    subjectId: classes[0]?.classSubjects[0]?.subject?.id || '',
    teacherId: teachers[0]?.id || '',
    dayOfWeek: 'MONDAY',
    startTime: '08:30 AM',
    endTime: '09:30 AM',
    roomNumber: 'Room 1001',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  const currentClass = classes.find((c) => c.id === slotForm.classId);
  const currentSections = currentClass?.sections || [];
  const currentSubjects = currentClass?.classSubjects?.map((cs: any) => cs.subject) || [];

  const filteredSlots = timetables.filter(
    (t) => !selectedClassId || t.classId === selectedClassId
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create slot');

      setTimetables((prev) => [...prev, data.timetable]);
      setIsAddModalOpen(false);
      success('Routine period added to timetable.');
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
            <CalendarDays className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Class & Teacher Timetables
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly class schedule matrix, classroom allocation, and subject lecture routines
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Add Schedule Slot
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View Class Routine:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Days Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const daySlots = filteredSlots.filter((s) => s.dayOfWeek === day);

          return (
            <div
              key={day}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col space-y-3"
            >
              <div className="pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                <span className="font-extrabold text-xs tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  {day}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{daySlots.length} Lectures</span>
              </div>

              <div className="space-y-2.5 flex-1">
                {daySlots.length > 0 ? (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {slot.startTime}
                        </span>
                        <span>{slot.roomNumber}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {slot.subject?.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {slot.teacher?.firstName} {slot.teacher?.lastName}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    No periods assigned.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Timetable Lecture Slot"
        subtitle="Assign class, subject, teacher, and room allocation"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class
              </label>
              <select
                value={slotForm.classId}
                onChange={(e) => {
                  const targetClass = classes.find((c) => c.id === e.target.value);
                  setSlotForm({
                    ...slotForm,
                    classId: e.target.value,
                    sectionId: targetClass?.sections[0]?.id || '',
                    subjectId: targetClass?.classSubjects[0]?.subject?.id || '',
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={slotForm.dayOfWeek}
                onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={slotForm.subjectId}
                onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {currentSubjects.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teacher
              </label>
              <select
                value={slotForm.teacherId}
                onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="08:30 AM"
                value={slotForm.startTime}
                onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="09:30 AM"
                value={slotForm.endTime}
                onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room No
              </label>
              <input
                type="text"
                value={slotForm.roomNumber}
                onChange={(e) => setSlotForm({ ...slotForm, roomNumber: e.target.value })}
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
              Confirm Period
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

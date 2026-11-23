'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Filter,
  Download,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Role } from '@/lib/auth';

interface AttendanceClientProps {
  user: { role: Role };
  classes: any[];
  initialStudents: any[];
}

export default function AttendanceClient({
  user,
  classes,
  initialStudents,
}: AttendanceClientProps) {
  const { success, error } = useToast();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState<any[]>(initialStudents);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialStudents.forEach((s) => {
      map[s.id] = s.attendances?.[0]?.status || 'PRESENT';
    });
    return map;
  });
  const [saving, setSaving] = useState(false);

  const canMark = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user.role);

  const handleClassChange = async (classId: string) => {
    setSelectedClassId(classId);
    try {
      const res = await fetch(`/api/attendance?classId=${classId}&date=${selectedDate}`);
      const data = await res.json();
      if (res.ok && data.students) {
        setStudents(data.students);
        const map: Record<string, string> = {};
        data.students.forEach((s: any) => {
          map[s.id] = s.attendances?.[0]?.status || 'PRESENT';
        });
        setAttendanceMap(map);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    if (!canMark) return;
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    if (!canMark) return;
    const nextMap: Record<string, string> = {};
    students.forEach((s) => {
      nextMap[s.id] = 'PRESENT';
    });
    setAttendanceMap(nextMap);
    success('Marked all students as PRESENT');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: attendanceMap[s.id] || 'PRESENT',
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          records,
          date: selectedDate,
        }),
      });

      if (!res.ok) throw new Error('Failed to save attendance');
      success(`Attendance successfully logged for ${records.length} students!`);
    } catch (err: any) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === 'LATE').length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Attendance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time daily roll call, absence tracking, and attendance analytics
          </p>
        </div>

        {canMark && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Records'}
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
            />
          </div>
        </div>

        {/* Real-time Summary Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            {presentCount} Present
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
            {absentCount} Absent
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            {lateCount} Late
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            {attendanceRate}% Ratio
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4 text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((s) => {
                const currentStatus = attendanceMap[s.id] || 'PRESENT';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-indigo-600">#{s.rollNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.class?.name} - {s.section?.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(s.id, 'PRESENT')}
                          disabled={!canMark}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'ABSENT')}
                          disabled={!canMark}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'LATE')}
                          disabled={!canMark}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'EXCUSED')}
                          disabled={!canMark}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'EXCUSED'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

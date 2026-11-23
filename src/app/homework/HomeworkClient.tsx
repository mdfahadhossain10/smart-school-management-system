'use client';

import React, { useState } from 'react';
import { BookOpenCheck, Plus, Calendar, Clock, CheckCircle2, User, FileText } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface HomeworkClientProps {
  user: { role: Role; name: string };
  initialHomeworks: any[];
  classes: any[];
}

export default function HomeworkClient({
  user,
  initialHomeworks,
  classes,
}: HomeworkClientProps) {
  const { success, error } = useToast();
  const [homeworks, setHomeworks] = useState<any[]>(initialHomeworks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHwForSubmissions, setSelectedHwForSubmissions] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: classes[0]?.id || '',
    sectionId: classes[0]?.sections[0]?.id || '',
    subjectId: classes[0]?.classSubjects[0]?.subject?.id || '',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user.role);

  const currentClass = classes.find((c) => c.id === formData.classId);
  const currentSections = currentClass?.sections || [];
  const currentSubjects = currentClass?.classSubjects?.map((cs: any) => cs.subject) || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create assignment');

      setHomeworks((prev) => [data.homework, ...prev]);
      setIsCreateModalOpen(false);
      success(`Assignment "${data.homework.title}" posted for ${data.homework.class?.name}.`);
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
            <BookOpenCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Homework & Assignments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curriculum tasks, submission tracker, teacher feedback, and grading
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Assign Homework
          </button>
        )}
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {homeworks.map((hw) => (
          <div
            key={hw.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase">
                  {hw.subject?.name}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  Due {formatDate(hw.dueDate)}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2 leading-snug">
                {hw.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                {hw.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {hw.class?.name} - {hw.section?.name}
                </span>
                <span>Instructor: {hw.teacher?.firstName}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-emerald-600">
                  {hw.submissions?.length || 0} Submissions
                </span>
                <button
                  onClick={() => setSelectedHwForSubmissions(hw)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions Modal */}
      {selectedHwForSubmissions && (
        <Modal
          isOpen={!!selectedHwForSubmissions}
          onClose={() => setSelectedHwForSubmissions(null)}
          title={`Submissions: ${selectedHwForSubmissions.title}`}
          subtitle={`Class: ${selectedHwForSubmissions.class?.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-3">
            {selectedHwForSubmissions.submissions?.length > 0 ? (
              selectedHwForSubmissions.submissions.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {sub.student?.firstName} {sub.student?.lastName} (#{sub.student?.rollNumber})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                      Grade: {sub.grade || 'A+'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{sub.content}</p>
                  {sub.feedback && (
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[11px] text-indigo-700 dark:text-indigo-300">
                      <span className="font-bold">Teacher Feedback:</span> {sub.feedback}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No student submissions uploaded yet.</p>
            )}
          </div>
        </Modal>
      )}

      {/* Create Homework Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Assign New Homework"
        subtitle="Post curriculum problem set or project guidelines"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kinematics & Free Fall Problem Set"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class
              </label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const targetClass = classes.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
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
                Section
              </label>
              <select
                value={formData.sectionId}
                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {currentSections.map((sec: any) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
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
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
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
                Submission Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Instructions & Problem Set Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="State question numbers, references, or submission instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

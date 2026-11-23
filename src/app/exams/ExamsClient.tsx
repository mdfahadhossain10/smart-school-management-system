'use client';

import React, { useState } from 'react';
import { Award, Plus, Calendar, BookOpen, Printer, CheckCircle2, FileText, School } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface ExamsClientProps {
  user: { role: Role };
  initialExams: any[];
  classes: any[];
  initialResults: any[];
  settings: any;
}

export default function ExamsClient({
  user,
  initialExams,
  classes,
  initialResults,
  settings,
}: ExamsClientProps) {
  const { success, error } = useToast();
  const [exams, setExams] = useState<any[]>(initialExams);
  const [results, setResults] = useState<any[]>(initialResults);
  const [activeTab, setActiveTab] = useState<'schedules' | 'results' | 'reportcard'>('schedules');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // Form states
  const [newExamData, setNewExamData] = useState({
    title: '',
    term: 'Term 1',
    startDate: '2026-11-15',
    endDate: '2026-11-25',
    status: 'UPCOMING',
  });

  const [markData, setMarkData] = useState({
    examId: exams[0]?.id || '',
    classId: classes[0]?.id || '',
    studentId: classes[0]?.students[0]?.id || '',
    subjectId: classes[0]?.classSubjects[0]?.subject?.id || '',
    marksObtained: '85',
    maxMarks: '100',
    remarks: 'Consistent academic understanding',
  });

  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any>(
    classes[0]?.students[0] || null
  );

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user.role);

  const currentClass = classes.find((c) => c.id === markData.classId);
  const currentStudents = currentClass?.students || [];
  const currentSubjects = currentClass?.classSubjects?.map((cs: any) => cs.subject) || [];

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExamData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create exam');

      setExams((prev) => [data.exam, ...prev]);
      setIsCreateModalOpen(false);
      success(`Examination session "${data.exam.title}" created.`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(markData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record marks');

      setResults((prev) => [data.result, ...prev.filter((r) => r.id !== data.result.id)]);
      setIsMarkModalOpen(false);
      success(`Grade ${data.result.grade} (GPA: ${data.result.gpa}) awarded successfully!`);
    } catch (err: any) {
      error(err.message);
    }
  };

  // Student specific results for report card
  const studentResults = results.filter((r) => r.studentId === selectedStudentForReport?.id);
  const totalGPA =
    studentResults.length > 0
      ? (studentResults.reduce((acc, r) => acc + r.gpa, 0) / studentResults.length).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Examination & Report Cards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Term exam routines, subject grading, merit list analysis, and printable official transcripts
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMarkModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Enter Student Marks
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Schedule New Exam
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schedules'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Exam Routines & Dates
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Grade Registry & Marks
        </button>
        <button
          onClick={() => setActiveTab('reportcard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reportcard'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Official Report Card (Printable)
        </button>
      </div>

      {/* Tab 1: Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-6 no-print">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase">
                      {exam.term}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{exam.title}</h3>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDate(exam.startDate)} — {formatDate(exam.endDate)}
                </div>
              </div>

              {/* Schedules Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100 dark:border-slate-800">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Time Window</th>
                      <th className="py-2.5 px-3">Examination Hall</th>
                      <th className="py-2.5 px-3 text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {exam.schedules?.length > 0 ? (
                      exam.schedules.map((sch: any) => (
                        <tr key={sch.id}>
                          <td className="py-2.5 px-3 font-semibold">{formatDate(sch.date)}</td>
                          <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                            {sch.subject?.name} ({sch.subject?.code})
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{sch.class?.name}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {sch.startTime} - {sch.endTime}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{sch.roomNumber || 'Main Auditorium'}</td>
                          <td className="py-2.5 px-3 text-right font-black">{sch.maxMarks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-400 text-xs">
                          Schedules being finalized by examination committee.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Results Registry */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden no-print space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Exam Results Master Ledger</h3>
              <p className="text-xs text-slate-500">Recorded grades, marks obtained, and GPA scores</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Exam Session</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Evaluator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {r.student?.firstName} {r.student?.lastName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Roll #{r.student?.rollNumber} • {r.student?.class?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{r.exam?.title}</td>
                    <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-semibold">{r.subject?.name}</td>
                    <td className="py-3 px-4 font-black">
                      {r.marksObtained} / {r.maxMarks}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{r.gpa.toFixed(1)}</td>
                    <td className="py-3 px-4 text-slate-500">{r.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official Printable Report Card */}
      {activeTab === 'reportcard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Student:</span>
              <select
                value={selectedStudentForReport?.id}
                onChange={(e) => {
                  const std = classes
                    .flatMap((c) => c.students)
                    .find((s) => s.id === e.target.value);
                  setSelectedStudentForReport(std);
                }}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
              >
                {classes.flatMap((c) => c.students).map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.rollNumber} - {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Official Report Card
            </button>
          </div>

          {/* Printable Report Card Sheet */}
          <div className="printable-area bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-2 border-slate-200 shadow-2xl max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-indigo-600">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center mb-2">
                <School className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider text-indigo-900">
                {settings?.schoolName || 'Smart Academy International'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{settings?.address}</p>
              <p className="text-xs text-slate-500">Phone: {settings?.phone} • Email: {settings?.email}</p>
              <div className="inline-block mt-3 px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-widest border border-indigo-200">
                Official Academic Performance Transcript
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Student Name</span>
                <span className="font-bold text-slate-900">
                  {selectedStudentForReport?.firstName} {selectedStudentForReport?.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Roll Number</span>
                <span className="font-bold text-slate-900">#{selectedStudentForReport?.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Academic Term</span>
                <span className="font-bold text-slate-900">{exams[0]?.title || 'Mid-Term 2026'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Overall GPA</span>
                <span className="font-black text-indigo-600 text-sm">{totalGPA} / 4.0</span>
              </div>
            </div>

            {/* Marks Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Max Marks</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentResults.length > 0 ? (
                    studentResults.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{r.subject?.name}</td>
                        <td className="py-2.5 px-3 text-center">{r.maxMarks}</td>
                        <td className="py-2.5 px-3 text-center font-bold">{r.marksObtained}</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-indigo-700">{r.grade}</td>
                        <td className="py-2.5 px-3 text-center font-bold">{r.gpa.toFixed(1)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                        No subject evaluation records on file for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Principal Signature & School Stamp */}
            <div className="pt-10 flex items-center justify-between text-xs text-slate-600">
              <div className="text-center">
                <span className="block font-serif italic text-base">Sarah Jenkins</span>
                <span className="block border-t border-slate-300 pt-1 text-[10px] font-semibold uppercase">
                  Class Teacher Signature
                </span>
              </div>
              <div className="w-24 h-24 rounded-full border-2 border-indigo-500/40 flex items-center justify-center text-[10px] font-extrabold uppercase text-indigo-600/50 rotate-[-12deg]">
                OFFICIAL SEAL
              </div>
              <div className="text-center">
                <span className="block font-serif italic text-base">Dr. Arthur Pendelton</span>
                <span className="block border-t border-slate-300 pt-1 text-[10px] font-semibold uppercase">
                  Principal Signature
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Examination Session"
        subtitle="Establish academic test or final term evaluation"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Final Examination 2026"
              value={newExamData.title}
              onChange={(e) => setNewExamData({ ...newExamData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Term
              </label>
              <select
                value={newExamData.term}
                onChange={(e) => setNewExamData({ ...newExamData, term: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="Term 1">Term 1</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Term 2">Term 2</option>
                <option value="Finals">Finals</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={newExamData.status}
                onChange={(e) => setNewExamData({ ...newExamData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={newExamData.startDate}
                onChange={(e) => setNewExamData({ ...newExamData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={newExamData.endDate}
                onChange={(e) => setNewExamData({ ...newExamData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
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
              Publish Examination
            </button>
          </div>
        </form>
      </Modal>

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Record Student Subject Grade"
        subtitle="Submit marks and compute letter grade & GPA"
      >
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Examination
            </label>
            <select
              value={markData.examId}
              onChange={(e) => setMarkData({ ...markData, examId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class
              </label>
              <select
                value={markData.classId}
                onChange={(e) => {
                  const targetClass = classes.find((c) => c.id === e.target.value);
                  setMarkData({
                    ...markData,
                    classId: e.target.value,
                    studentId: targetClass?.students[0]?.id || '',
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
                Student
              </label>
              <select
                value={markData.studentId}
                onChange={(e) => setMarkData({ ...markData, studentId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                {currentStudents.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    #{s.rollNumber} - {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <select
              value={markData.subjectId}
              onChange={(e) => setMarkData({ ...markData, subjectId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            >
              {currentSubjects.map((sub: any) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marks Obtained *
              </label>
              <input
                type="number"
                required
                value={markData.marksObtained}
                onChange={(e) => setMarkData({ ...markData, marksObtained: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Maximum Marks
              </label>
              <input
                type="number"
                required
                value={markData.maxMarks}
                onChange={(e) => setMarkData({ ...markData, maxMarks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remarks / Feedback
            </label>
            <input
              type="text"
              value={markData.remarks}
              onChange={(e) => setMarkData({ ...markData, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMarkModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Save Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

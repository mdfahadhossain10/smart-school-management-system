'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  IdCard,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface StudentsClientProps {
  user: { role: Role };
  initialStudents: any[];
  classes: any[];
}

export default function StudentsClient({
  user,
  initialStudents,
  classes,
}: StudentsClientProps) {
  const { success, error } = useToast();
  const [students, setStudents] = useState<any[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '2010-05-15',
    bloodGroup: 'O+',
    email: '',
    phone: '',
    address: '',
    rollNumber: '',
    classId: classes[0]?.id || '',
    sectionId: classes[0]?.sections[0]?.id || '',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  // Available sections for the currently selected class in form
  const currentSections =
    classes.find((c) => c.id === formData.classId)?.sections || [];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase());

    const matchesClass = selectedClass === 'ALL' || s.classId === selectedClass;

    return matchesSearch && matchesClass;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');

      setStudents((prev) => [data.student, ...prev]);
      setIsAddModalOpen(false);
      success(`${data.student.firstName} ${data.student.lastName} admitted successfully!`);
      setFormData({
        firstName: '',
        lastName: '',
        gender: 'Male',
        dob: '2010-05-15',
        bloodGroup: 'O+',
        email: '',
        phone: '',
        address: '',
        rollNumber: '',
        classId: classes[0]?.id || '',
        sectionId: classes[0]?.sections[0]?.id || '',
      });
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleEditOpen = (student: any) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dob: student.dob?.split('T')[0] || '2010-05-15',
      bloodGroup: student.bloodGroup || 'O+',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      rollNumber: student.rollNumber,
      classId: student.classId,
      sectionId: student.sectionId,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update student');

      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? data.student : s))
      );
      setIsEditModalOpen(false);
      success('Student record updated successfully!');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the student registry?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');

      setStudents((prev) => prev.filter((s) => s.id !== id));
      success('Student record removed successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Roll No', 'Admission No', 'First Name', 'Last Name', 'Class', 'Section', 'Gender', 'Blood Group', 'Phone'];
    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      s.admissionNumber,
      s.firstName,
      s.lastName,
      s.class?.name || '',
      s.section?.name || '',
      s.gender,
      s.bloodGroup,
      s.phone || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Student directory exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Student Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {students.length} students enrolled in the current academic year
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Admit New Student
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="ALL">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll / Adm ID</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Blood</th>
                <th className="py-3.5 px-4">Parent Phone</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={s.firstName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{s.email || 'No institutional email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">#{s.rollNumber}</span>
                      <p className="text-[11px] text-slate-400">{s.admissionNumber}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {s.class?.name}
                      </span>
                      <span className="ml-1 text-[11px] text-slate-500">Sec {s.section?.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.gender}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {s.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {s.parent?.phone || s.phone || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/students/${s.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Profile & Print ID Card"
                        >
                          <IdCard className="w-4 h-4" />
                        </Link>
                        {canManage && (
                          <>
                            <button
                              onClick={() => handleEditOpen(s)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-500">
                    No student records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Student Admission Form"
        subtitle="Admit a student into the school system"
        maxWidth="2xl"
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
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assign Class *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const targetClass = classes.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    sectionId: targetClass?.sections[0]?.id || '',
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
                Section *
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                placeholder="Auto-assigned if left blank"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email
              </label>
              <input
                type="email"
                placeholder="student@smartacademy.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+1 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              Complete Admission
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Record"
        subtitle="Modify profile and academic placement"
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name
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
                Last Name
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
                Roll Number
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

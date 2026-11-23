'use client';

import React, { useState } from 'react';
import { BellRing, Plus, Pin, Calendar, User, Search, Filter } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface NoticesClientProps {
  user: { role: Role; name: string };
  initialNotices: any[];
}

export default function NoticesClient({ user, initialNotices }: NoticesClientProps) {
  const { success, error } = useToast();
  const [notices, setNotices] = useState<any[]>(initialNotices);
  const [search, setSearch] = useState('');
  const [targetFilter, setTargetFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'ALL',
    isPinned: false,
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());

    const matchesTarget = targetFilter === 'ALL' || n.targetAudience === targetFilter;
    return matchesSearch && matchesTarget;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish notice');

      setNotices((prev) => [data.notice, ...prev]);
      setIsAddModalOpen(false);
      success('Notice published to the campus bulletin!');
      setFormData({
        title: '',
        content: '',
        targetAudience: 'ALL',
        isPinned: false,
      });
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
            <BellRing className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Institutional Notice Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official announcements, academic calendars, event notifications, and urgent campus alerts
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Publish Announcement
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulletins and announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
          >
            <option value="ALL">All Audiences</option>
            <option value="TEACHERS">Teachers Only</option>
            <option value="STUDENTS">Students Only</option>
            <option value="PARENTS">Parents Only</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`rounded-3xl border p-6 shadow-sm transition-all relative flex flex-col justify-between ${
              n.isPinned
                ? 'bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-200 dark:border-indigo-900/50'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Target: {n.targetAudience}
                </span>
                {n.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3 fill-amber-500" />
                    Pinned Notice
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {n.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                {n.content}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {n.publishedBy}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(n.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Publish Campus Bulletin"
        subtitle="Post institutional notice across student and faculty portals"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Fair Registration Open"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              >
                <option value="ALL">Entire Campus (All)</option>
                <option value="TEACHERS">Faculty Only</option>
                <option value="STUDENTS">Students Only</option>
                <option value="PARENTS">Parents Only</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Pin to top of notice board
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Content *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Draft announcement details, dates, and instructions..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
              Publish to Bulletin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

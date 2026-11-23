'use client';

import React, { useState } from 'react';
import { User, Lock, Phone, Mail, Shield, CheckCircle2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface ProfileClientProps {
  user: { role: Role };
  userData: any;
}

export default function ProfileClient({ user, userData }: ProfileClientProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: userData.name || '',
    phone: userData.phone || '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      success('Profile details updated successfully!');
      setFormData((prev) => ({ ...prev, newPassword: '' }));
    } catch (err: any) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          My Account & Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Identity credentials, security settings, and personal details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Bio Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
          <img
            src={userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={userData.name}
            className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20"
          />
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3">{userData.name}</h2>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
            {userData.role.replace('_', ' ')}
          </span>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status:</span>
              <span className="font-bold text-emerald-600">{userData.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Registered:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(userData.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Institutional)
              </label>
              <input
                type="email"
                disabled
                value={userData.email}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Change Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="Enter new strong password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Updating...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

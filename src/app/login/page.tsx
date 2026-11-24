'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'superadmin@smartacademy.edu', pass: 'Admin@123', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { role: 'School Admin', email: 'schooladmin@smartacademy.edu', pass: 'Admin@123', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { role: 'Principal', email: 'principal@smartacademy.edu', pass: 'Password@123', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { role: 'Teacher', email: 'teacher@smartacademy.edu', pass: 'Password@123', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { role: 'Student', email: 'student@smartacademy.edu', pass: 'Password@123', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { role: 'Parent', email: 'parent@smartacademy.edu', pass: 'Password@123', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { role: 'Accountant', email: 'accountant@smartacademy.edu', pass: 'Password@123', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { role: 'Librarian', email: 'librarian@smartacademy.edu', pass: 'Password@123', color: 'bg-teal-50 border-teal-200 text-teal-700' },
];

export default function LoginPage() {
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();
  const [email, setEmail] = useState('superadmin@smartacademy.edu');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Top Language Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-all shadow-md backdrop-blur-md"
          title={lang === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
        >
          <Languages className="w-4 h-4 text-indigo-400" />
          <span>{lang === 'en' ? 'বাংলা (Bangla)' : 'English (EN)'}</span>
        </button>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20 mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('Smart School')} ERP
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {t('Enterprise Grade Modern School Management and ERP Platform')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('Email Address')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@smartacademy.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">{t('Password')}</label>
                <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  {lang === 'bn' ? 'ভুলে গেছেন?' : 'Forgot?'}
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? t('Signing in...') : t('Sign In to Dashboard')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('Instant 1-Click Role Testing', 'Quick Demo Role Selector (1-Click)')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickSelect(acc.email, acc.pass)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border text-center transition-all hover:scale-105 ${
                    email === acc.email
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {t(acc.role, acc.role)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

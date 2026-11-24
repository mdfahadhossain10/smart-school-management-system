'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Check,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { Role } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string | null;
  };
  onMenuClick: () => void;
}

const ALL_ROLES: { role: Role; label: string; desc: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full System Control' },
  { role: 'SCHOOL_ADMIN', label: 'School Admin', desc: 'Institutional Control' },
  { role: 'PRINCIPAL', label: 'Principal', desc: 'Academic Leadership' },
  { role: 'TEACHER', label: 'Teacher', desc: 'Grades, Attendance, Classes' },
  { role: 'STUDENT', label: 'Student', desc: 'Academics & Fee Invoices' },
  { role: 'PARENT', label: 'Parent', desc: 'Child Monitoring & Payments' },
  { role: 'ACCOUNTANT', label: 'Accountant', desc: 'Finances, Fees & Payroll' },
  { role: 'LIBRARIAN', label: 'Librarian', desc: 'Catalog & Book Circulations' },
];

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { lang, setLang, toggleLang, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Sync dark mode state with document
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleRoleSwitch = async (targetRole: Role) => {
    setIsRoleDropdownOpen(false);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        router.refresh();
        window.location.href = '/dashboard';
      }
    } catch (e) {
      console.error('Role switch error', e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/60 border border-transparent focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher (EN / বাংলা) */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-100 transition-all shadow-sm group"
              title={lang === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
            >
              <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:rotate-12" />
              <span className="font-semibold">{lang === 'en' ? 'English' : 'বাংলা'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isLangDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                <button
                  onClick={() => {
                    setLang('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    lang === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>English</span>
                  </span>
                  {lang === 'en' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
                <button
                  onClick={() => {
                    setLang('bn');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    lang === 'bn' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🇧🇩</span>
                    <span>বাংলা (Bangla)</span>
                  </span>
                  {lang === 'bn' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
              title="Test any of the 8 user roles instantly"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">{t('Role:')}</span>
              <span className="font-bold">{t(user.role, user.role.replace('_', ' '))}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isRoleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    {t('Switch Active Role')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('Experience all 8 distinct dashboard views')}
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {ALL_ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => handleRoleSwitch(r.role)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                        user.role === r.role
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{t(r.role, r.label)}</p>
                        <p className="text-[10px] text-slate-400">{t(r.desc, r.desc)}</p>
                      </div>
                      {user.role === r.role && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? t('switchToLight', 'Switch to Light Mode') : t('switchToDark', 'Switch to Dark Mode')}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title={t('Notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {isNotificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {t('Notifications')}
                  </h4>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer">
                    {t('Mark all read')}
                  </span>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('Daily Attendance Synced')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('Grade 10 attendance processed with 96% presence.')}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('Fee Payment Received')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('Receipt RCT-2026-0001 verified for ৳450.00.')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">{t(user.role, user.role.toLowerCase())}</span>
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    {t('My Profile')}
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      router.push('/settings');
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    {t('School Settings')}
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('Sign Out')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

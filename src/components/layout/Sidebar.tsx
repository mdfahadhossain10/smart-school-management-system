'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users2,
  School,
  CalendarCheck,
  Award,
  CreditCard,
  CalendarDays,
  BookOpenCheck,
  Library,
  Bus,
  UserCog,
  BellRing,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Role } from '@/lib/auth';

interface SidebarProps {
  userRole: Role;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: Role[];
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: 'CORE',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'LIBRARIAN'],
      },
    ],
  },
  {
    group: 'ACADEMICS',
    items: [
      {
        name: 'Students',
        href: '/students',
        icon: GraduationCap,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'],
      },
      {
        name: 'Teachers',
        href: '/teachers',
        icon: Users2,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'],
      },
      {
        name: 'Classes & Sections',
        href: '/classes',
        icon: School,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'],
      },
      {
        name: 'Attendance',
        href: '/attendance',
        icon: CalendarCheck,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'],
      },
      {
        name: 'Exams & Results',
        href: '/exams',
        icon: Award,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'],
      },
      {
        name: 'Timetable',
        href: '/timetable',
        icon: CalendarDays,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'],
      },
      {
        name: 'Homework',
        href: '/homework',
        icon: BookOpenCheck,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'],
      },
    ],
  },
  {
    group: 'ADMINISTRATION & FINANCE',
    items: [
      {
        name: 'Fees & Invoicing',
        href: '/fees',
        icon: CreditCard,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PARENT', 'STUDENT'],
      },
      {
        name: 'Library Hub',
        href: '/library',
        icon: Library,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT'],
      },
      {
        name: 'Transport Fleet',
        href: '/transport',
        icon: Bus,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT'],
      },
      {
        name: 'Staff & HR',
        href: '/staff',
        icon: UserCog,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT'],
      },
    ],
  },
  {
    group: 'COMMUNICATION & SYSTEM',
    items: [
      {
        name: 'Notice Board',
        href: '/notices',
        icon: BellRing,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'LIBRARIAN'],
      },
      {
        name: 'Analytics Reports',
        href: '/reports',
        icon: FileBarChart2,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER'],
      },
      {
        name: 'User Management',
        href: '/users',
        icon: ShieldCheck,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
      },
      {
        name: 'System Settings',
        href: '/settings',
        icon: Settings,
        roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
      },
    ],
  },
];

export default function Sidebar({ userRole, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <School className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white leading-none">
                  Smart School
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-1">
                  Management ERP
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Role Badge */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-300">
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, groupIdx) => {
            const filteredItems = group.items.filter((item) => item.roles.includes(userRole));
            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {group.group}
                  </h4>
                )}
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                      {item.badge && !isCollapsed && (
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Profile Shortcut */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-200">My Profile</span>
                <span className="text-[10px] text-slate-400">Account settings</span>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ToastProvider } from '@/components/ui/Toast';
import { Role } from '@/lib/auth';

interface DashboardLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string | null;
  };
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
        {/* Left Sidebar */}
        <Sidebar
          userRole={user.role}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
          <Navbar user={user} onMenuClick={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/ui/Toast';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </LanguageProvider>
  );
}

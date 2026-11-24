'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Navigation Groups
  'CORE': { en: 'CORE', bn: 'মূল মেনু' },
  'ACADEMICS': { en: 'ACADEMICS', bn: 'একাডেমিক' },
  'ADMINISTRATION & FINANCE': { en: 'ADMINISTRATION & FINANCE', bn: 'প্রশাসন ও অর্থ' },
  'COMMUNICATION & SYSTEM': { en: 'COMMUNICATION & SYSTEM', bn: 'যোগাযোগ ও সিস্টেম' },

  // Navigation Items
  'Dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'Students': { en: 'Students', bn: 'শিক্ষার্থীবৃন্দ' },
  'Teachers': { en: 'Teachers', bn: 'শিক্ষকমণ্ডলী' },
  'Classes & Sections': { en: 'Classes & Sections', bn: 'শ্রেণি ও শাখা' },
  'Attendance': { en: 'Attendance', bn: 'দৈনিক উপস্থিতি' },
  'Exams & Results': { en: 'Exams & Results', bn: 'পরীক্ষা ও ফলাফল' },
  'Timetable': { en: 'Timetable', bn: 'ক্লাস রুটিন' },
  'Homework': { en: 'Homework', bn: 'হোমওয়ার্ক ও অ্যাসাইনমেন্ট' },
  'Fees & Invoicing': { en: 'Fees & Invoicing', bn: 'ফি ও ইনভয়েসিং' },
  'Library Hub': { en: 'Library Hub', bn: 'গ্রন্থাগার / লাইব্রেরি' },
  'Transport Fleet': { en: 'Transport Fleet', bn: 'স্কুল পরিবহন' },
  'Staff & HR': { en: 'Staff & HR', bn: 'স্টাফ ও এইচআর' },
  'Notice Board': { en: 'Notice Board', bn: 'নোটিশ বোর্ড' },
  'Analytics Reports': { en: 'Analytics Reports', bn: 'রিপোর্ট ও পরিসংখ্যান' },
  'User Management': { en: 'User Management', bn: 'ব্যবহারকারী ব্যবস্থাপনা' },
  'System Settings': { en: 'System Settings', bn: 'প্রতিষ্ঠান সেটিংস' },
  'My Profile': { en: 'My Profile', bn: 'আমার প্রোফাইল' },
  'School Settings': { en: 'School Settings', bn: 'বিদ্যালয় সেটিংস' },
  'Account settings': { en: 'Account settings', bn: 'অ্যাকাউন্ট বিবরণ' },
  'Sign Out': { en: 'Sign Out', bn: 'লগআউট' },

  // Brand & Header
  'Smart School': { en: 'Smart School', bn: 'স্মার্ট স্কুল' },
  'Management ERP': { en: 'Management ERP', bn: 'ম্যানেজমেন্ট ইআরপি' },
  'Enterprise Grade Modern School Management and ERP Platform': {
    en: 'Enterprise Grade Modern School Management and ERP Platform',
    bn: 'উন্নত প্রযুক্তির আধুনিক স্কুল ম্যানেজমেন্ট ও ইআরপি প্ল্যাটফর্ম',
  },

  // Navbar
  'searchPlaceholder': {
    en: 'Search students, teachers, classes, records... (Press / to focus)',
    bn: 'শিক্ষার্থী, শিক্ষক, শ্রেণি বা যেকোনো রেকর্ড খুঁজুন... (ফোকাস করতে / চাপুন)',
  },
  'Role:': { en: 'Role:', bn: 'ভূমিকা:' },
  'Switch Active Role': { en: 'Switch Active Role', bn: 'ভূমিকা পরিবর্তন করুন' },
  'Experience all 8 distinct dashboard views': {
    en: 'Experience all 8 distinct dashboard views',
    bn: '৮টি আলাদা রোলের ড্যাশবোর্ড অভিজ্ঞতা নিন',
  },
  'Notifications': { en: 'Notifications', bn: 'বিজ্ঞপ্তিসমূহ' },
  'Mark all read': { en: 'Mark all read', bn: 'সব পঠিত হিসেবে চিহ্নিত করুন' },
  'Daily Attendance Synced': { en: 'Daily Attendance Synced', bn: 'দৈনিক উপস্থিতি সিঙ্ক হয়েছে' },
  'Grade 10 attendance processed with 96% presence.': {
    en: 'Grade 10 attendance processed with 96% presence.',
    bn: '১০ম শ্রেণির উপস্থিতি ৯৬% সহ রেকর্ড করা হয়েছে।',
  },
  'Fee Payment Received': { en: 'Fee Payment Received', bn: 'ফি পরিশোধ গৃহীত হয়েছে' },
  'Receipt RCT-2026-0001 verified for ৳450.00.': {
    en: 'Receipt RCT-2026-0001 verified for ৳450.00.',
    bn: 'মানি রিসিট RCT-2026-0001 যাচাই সম্পন্ন (৳৪৫০.০০)।',
  },

  // User Roles
  'SUPER_ADMIN': { en: 'Super Admin', bn: 'সুপার অ্যাডমিন' },
  'SCHOOL_ADMIN': { en: 'School Admin', bn: 'স্কুল অ্যাডমিন' },
  'PRINCIPAL': { en: 'Principal', bn: 'অধ্যক্ষ / প্রিন্সিপাল' },
  'TEACHER': { en: 'Teacher', bn: 'শিক্ষক' },
  'STUDENT': { en: 'Student', bn: 'শিক্ষার্থী' },
  'PARENT': { en: 'Parent', bn: 'অভিভাবক' },
  'ACCOUNTANT': { en: 'Accountant', bn: 'হিসাবরক্ষক' },
  'LIBRARIAN': { en: 'Librarian', bn: 'গ্রন্থাগারিক' },

  'Full System Control': { en: 'Full System Control', bn: 'সম্পূর্ণ সিস্টেম নিয়ন্ত্রণ' },
  'Institutional Control': { en: 'Institutional Control', bn: 'প্রাতিষ্ঠানিক নিয়ন্ত্রণ' },
  'Academic Leadership': { en: 'Academic Leadership', bn: 'একাডেমিক নেতৃত্ব' },
  'Grades, Attendance, Classes': { en: 'Grades, Attendance, Classes', bn: 'গ্রেড, উপস্থিতি ও ক্লাস' },
  'Academics & Fee Invoices': { en: 'Academics & Fee Invoices', bn: 'পড়াশোনা ও ফি ইনভয়েস' },
  'Child Monitoring & Payments': { en: 'Child Monitoring & Payments', bn: 'সন্তানের অগ্রগতি ও পেমেন্ট' },
  'Finances, Fees & Payroll': { en: 'Finances, Fees & Payroll', bn: 'আর্থিক হিসাব, ফি ও বেতন' },
  'Catalog & Book Circulations': { en: 'Catalog & Book Circulations', bn: 'বইয়ের ক্যাটালগ ও লেনদেন' },

  // Common Buttons & Actions
  'Add': { en: 'Add', bn: 'যোগ করুন' },
  'Edit': { en: 'Edit', bn: 'সম্পাদনা' },
  'Delete': { en: 'Delete', bn: 'মুছুন' },
  'Save': { en: 'Save', bn: 'সংরক্ষণ করুন' },
  'Save Changes': { en: 'Save Changes', bn: 'পরিবর্তন সংরক্ষণ করুন' },
  'Cancel': { en: 'Cancel', bn: 'বাতিল' },
  'Filter': { en: 'Filter', bn: 'ফিল্টার' },
  'Search': { en: 'Search', bn: 'অনুসন্ধান' },
  'Export': { en: 'Export', bn: 'এক্সপোর্ট' },
  'Export PDF': { en: 'Export PDF', bn: 'পিডিএফ এক্সপোর্ট' },
  'Export Excel': { en: 'Export Excel', bn: 'এক্সেল এক্সপোর্ট' },
  'Print': { en: 'Print', bn: 'প্রিন্ট করুন' },
  'Submit': { en: 'Submit', bn: 'সাবমিট করুন' },
  'Close': { en: 'Close', bn: 'বন্ধ করুন' },
  'Status': { en: 'Status', bn: 'স্ট্যাটাস' },
  'Actions': { en: 'Actions', bn: 'পদক্ষেপ' },
  'All': { en: 'All', bn: 'সকল' },
  'View Details': { en: 'View Details', bn: 'বিস্তারিত দেখুন' },

  // Dashboard Stats & Text
  'welcomeBack': { en: 'Welcome back', bn: 'স্বাগতম' },
  'systemOperational': { en: 'System Fully Operational', bn: 'সিস্টেম সম্পূর্ণ সচল রয়েছে' },
  'academicSession': { en: 'Academic Session: 2026-2027', bn: 'শিক্ষাবর্ষ: ২০২৬-২০২৭' },
  'Total Students': { en: 'Total Students', bn: 'মোট শিক্ষার্থী' },
  'Active Faculty': { en: 'Active Faculty', bn: 'সক্রিয় শিক্ষকবৃন্দ' },
  'Revenue Collected': { en: 'Revenue Collected', bn: 'সংগৃহীত রাজস্ব' },
  'Pending Fees': { en: 'Pending Fees', bn: 'বকেয়া ফি' },
  'Monthly Income & Expenditure': { en: 'Monthly Income & Expenditure', bn: 'মাসিক আয় ও ব্যয়ের হিসাব' },
  'Fiscal trajectory over past 6 months (in BDT)': {
    en: 'Fiscal trajectory over past 6 months (in BDT)',
    bn: 'গত ৬ মাসের আর্থিক বিবরণী (টাকায়)',
  },
  'Weekly Attendance Breakdown': { en: 'Weekly Attendance Breakdown', bn: 'সাপ্তাহিক উপস্থিতির হার' },
  'Across All Student Grades': { en: 'Across All Student Grades', bn: 'সকল শ্রেণির সার্বিক পরিসংখ্যান' },
  'Recent Financial Transactions': { en: 'Recent Financial Transactions', bn: 'সাম্প্রতিক লেনদেনসমূহ' },
  'Latest payments verified': { en: 'Latest payments verified', bn: 'যাচাইকৃত সর্বশেষ পেমেন্ট' },
  'Academic Announcements': { en: 'Academic Announcements', bn: 'একাডেমিক নোটিশ ও ঘোষণাসমূহ' },
  'Published circulars': { en: 'Published circulars', bn: 'প্রকাশিত প্রাতিষ্ঠানিক নোটিশ' },
  'Mark Attendance': { en: 'Mark Attendance', bn: 'উপস্থিতি গ্রহণ' },
  'View Report Card': { en: 'View Report Card', bn: 'ফলাফল পত্র দেখুন' },
  'Enrolled across Grades 8-12': { en: 'Enrolled across Grades 8-12', bn: '৮ম থেকে ১২শ শ্রেণি পর্যন্ত ভর্তিকৃত' },
  'All academic departments': { en: 'All academic departments', bn: 'সকল বিভাগীয় শিক্ষক' },
  'Total fees settled this year': { en: 'Total fees settled this year', bn: 'চলতি বছর পরিশোধিত ফি' },
  'Outstanding invoice balances': { en: 'Outstanding invoice balances', bn: 'বর্তমান বকেয়া ইনভয়েস' },
  'Income': { en: 'Income', bn: 'আয়' },
  'Expenses': { en: 'Expenses', bn: 'ব্যয়' },

  // Attendance Statuses
  'PRESENT': { en: 'Present', bn: 'উপস্থিত' },
  'ABSENT': { en: 'Absent', bn: 'অনুপস্থিত' },
  'LATE': { en: 'Late', bn: 'দেরিতে' },
  'HALF_DAY': { en: 'Half Day', bn: 'অর্ধদিবস' },

  // Fee Statuses
  'PAID': { en: 'Paid', bn: 'পরিশোধিত' },
  'PENDING': { en: 'Pending', bn: 'বকেয়া' },
  'PARTIAL': { en: 'Partial', bn: 'আংশিক পরিশোধ' },
  'OVERDUE': { en: 'Overdue', bn: 'মেয়াদোত্তীর্ণ' },

  // Login Page
  'Smart Academy International': { en: 'Smart Academy International', bn: 'স্মার্ট একাডেমি ইন্টারন্যাশনাল' },
  'Excellence in Modern Education': { en: 'Excellence in Modern Education', bn: 'আধুনিক শিক্ষায় অনন্য উৎকর্ষ' },
  'Sign In to Dashboard': { en: 'Sign In to Dashboard', bn: 'ড্যাশবোর্ডে লগইন করুন' },
  'Enter your institutional credentials': {
    en: 'Enter your institutional credentials to access your portal',
    bn: 'আপনার পোর্টালে প্রবেশ করতে প্রাতিষ্ঠানিক তথ্য দিন',
  },
  'Email Address': { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
  'Password': { en: 'Password', bn: 'পাসওয়ার্ড' },
  'Instant 1-Click Role Testing': { en: 'Instant 1-Click Role Testing', bn: '১-ক্লিকে যেকোনো রোলে ডেমো লগইন' },
  'Select any profile below to prefill demo login': {
    en: 'Select any profile below to prefill demo login credentials',
    bn: 'নিচে যেকোনো প্রোফাইলে ক্লিক করলেই স্বয়ংক্রিয়ভাবে লগইন তথ্য পূরণ হবে',
  },
  'Signing in...': { en: 'Signing in...', bn: 'প্রবেশ করা হচ্ছে...' },
};

// Digits translation map for English to Bengali digits
export function toBnDigits(num: number | string): string {
  const bnDigits: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };
  return String(num).replace(/[0-9]/g, (match) => bnDigits[match] || match);
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
  isBn: boolean;
  toBn: (num: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  isBn: false,
  toBn: (num) => String(num),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_lang') as Language;
      if (saved === 'en' || saved === 'bn') {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return fallback || key;
  };

  const toBn = (num: number | string): string => {
    if (lang === 'bn') {
      return toBnDigits(num);
    }
    return String(num);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        isBn: lang === 'bn',
        toBn,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

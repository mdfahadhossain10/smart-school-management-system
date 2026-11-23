import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue';
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'indigo',
  subtitle,
}: StatCardProps) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
  }[color];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-3 rounded-xl ${colorMap.bg} ${colorMap.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
}

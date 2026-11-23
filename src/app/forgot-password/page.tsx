'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 mb-3">
            <School className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your institutional email to receive recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-300">Password Reset Email Sent</h3>
            <p className="text-xs text-slate-400">
              If an account with <span className="text-white font-medium">{email}</span> exists, a recovery link has been dispatched.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="user@smartacademy.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              Send Reset Instructions
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

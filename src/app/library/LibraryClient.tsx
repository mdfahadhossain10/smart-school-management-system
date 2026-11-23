'use client';

import React, { useState } from 'react';
import { Library, Plus, Search, BookOpen, CheckCircle, ArrowRightLeft } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface LibraryClientProps {
  user: { role: Role };
  initialBooks: any[];
  students: any[];
}

export default function LibraryClient({
  user,
  initialBooks,
  students,
}: LibraryClientProps) {
  const { success, error } = useToast();
  const [books, setBooks] = useState<any[]>(initialBooks);
  const [search, setSearch] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<any>(null);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Science',
    totalCopies: '5',
    shelfNumber: 'Shelf S-01',
  });

  const [issueForm, setIssueForm] = useState({
    studentId: students[0]?.id || '',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'LIBRARIAN'].includes(user.role);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add book');

      setBooks((prev) => [data.book, ...prev]);
      setIsAddBookModalOpen(false);
      success(`Book "${data.book.title}" added to library catalog.`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleOpenIssue = (book: any) => {
    setSelectedBookForIssue(book);
    setIsIssueModalOpen(true);
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookForIssue.id,
          ...issueForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue book');

      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedBookForIssue.id
            ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
            : b
        )
      );
      setIsIssueModalOpen(false);
      success(`Book issued to student.`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleReturnBook = async (issueId: string, bookId: string) => {
    try {
      const res = await fetch('/api/library/issues', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId }),
      });

      if (!res.ok) throw new Error('Failed to return book');

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? {
                ...b,
                availableCopies: b.availableCopies + 1,
                issues: b.issues?.filter((i: any) => i.id !== issueId),
              }
            : b
        )
      );
      success('Book marked as returned and copy restored.');
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
            <Library className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Library Catalog & Circulation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Book repository, circulation desk, lending records, and shelf cataloging
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Catalog New Book
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search books by title, author, ISBN number, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Title & Author</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Shelf No</th>
                <th className="py-3 px-4">Copies</th>
                <th className="py-3 px-4">Active Borrowers</th>
                <th className="py-3 px-4 text-right">Circulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{b.title}</p>
                    <p className="text-[11px] text-slate-400">By {b.author}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">{b.isbn}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{b.shelfNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{b.availableCopies}</span>
                    <span className="text-slate-400 text-[11px]"> / {b.totalCopies}</span>
                  </td>
                  <td className="py-3 px-4">
                    {b.issues?.length > 0 ? (
                      b.issues.map((i: any) => (
                        <div key={i.id} className="flex items-center gap-1.5 py-0.5">
                          <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                            {i.student?.firstName} {i.student?.lastName}
                          </span>
                          {canManage && (
                            <button
                              onClick={() => handleReturnBook(i.id, b.id)}
                              className="text-[10px] text-emerald-600 hover:underline font-bold"
                            >
                              (Return)
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">No active loans</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {canManage && b.availableCopies > 0 && (
                      <button
                        onClick={() => handleOpenIssue(b)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Issue Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        title="Add Book to Library Catalog"
        subtitle="Catalog a textbook, fiction, or reference volume"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author *
              </label>
              <input
                type="text"
                required
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ISBN Number *
              </label>
              <input
                type="text"
                required
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                value={bookForm.totalCopies}
                onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shelf Location
              </label>
              <input
                type="text"
                value={bookForm.shelfNumber}
                onChange={(e) => setBookForm({ ...bookForm, shelfNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddBookModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Catalog Book
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Student"
        subtitle={`Book: ${selectedBookForIssue?.title}`}
      >
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student
            </label>
            <select
              value={issueForm.studentId}
              onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.rollNumber} - {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Return Due Date
            </label>
            <input
              type="date"
              required
              value={issueForm.dueDate}
              onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Issue Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

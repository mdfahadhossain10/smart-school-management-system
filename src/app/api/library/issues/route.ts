import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'LIBRARIAN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bookId, studentId, dueDate } = await request.json();

    const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
    if (!book || book.availableCopies <= 0) {
      return NextResponse.json({ error: 'No available copies for this book' }, { status: 400 });
    }

    const [issue] = await prisma.$transaction([
      prisma.bookIssue.create({
        data: {
          bookId,
          studentId,
          dueDate: new Date(dueDate),
          status: 'ISSUED',
        },
      }),
      prisma.libraryBook.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, issue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'LIBRARIAN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { issueId } = await request.json();

    const issue = await prisma.bookIssue.findUnique({ where: { id: issueId } });
    if (!issue) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

    await prisma.$transaction([
      prisma.bookIssue.update({
        where: { id: issueId },
        data: { status: 'RETURNED', returnDate: new Date() },
      }),
      prisma.libraryBook.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Book returned successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

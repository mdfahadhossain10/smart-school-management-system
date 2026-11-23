import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { isbn: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const books = await prisma.libraryBook.findMany({
      where,
      include: {
        issues: {
          where: { status: 'ISSUED' },
          include: { student: true },
        },
      },
      orderBy: { title: 'asc' },
    });

    const students = await prisma.student.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, rollNumber: true },
    });

    return NextResponse.json({ success: true, books, students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'LIBRARIAN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, author, isbn, category, totalCopies, shelfNumber } = await request.json();

    const copies = parseInt(totalCopies) || 1;

    const book = await prisma.libraryBook.create({
      data: {
        title,
        author,
        isbn,
        category: category || 'General',
        totalCopies: copies,
        availableCopies: copies,
        shelfNumber: shelfNumber || 'Shelf A-1',
      },
    });

    return NextResponse.json({ success: true, book });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        schedules: {
          include: {
            class: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true, code: true } },
          },
          orderBy: { date: 'asc' },
        },
        _count: { select: { results: true } },
      },
      orderBy: { startDate: 'desc' },
    });

    const classes = await prisma.class.findMany({
      include: {
        classSubjects: { include: { subject: true } },
        students: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
      },
      orderBy: { numericGrade: 'asc' },
    });

    const results = await prisma.examResult.findMany({
      include: {
        exam: { select: { id: true, title: true } },
        student: { select: { id: true, firstName: true, lastName: true, rollNumber: true, class: { select: { name: true } } } },
        subject: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, exams, classes, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, term, startDate, endDate, status } = await request.json();

    const exam = await prisma.exam.create({
      data: {
        title,
        term: term || 'Mid-Term',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'UPCOMING',
      },
      include: { schedules: true },
    });

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const homeworks = await prisma.homework.findMany({
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
        submissions: { include: { student: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const classes = await prisma.class.findMany({
      include: { sections: true, classSubjects: { include: { subject: true } } },
      orderBy: { numericGrade: 'asc' },
    });

    return NextResponse.json({ success: true, homeworks, classes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, description, classId, sectionId, subjectId, dueDate } = await request.json();

    const teacher = await prisma.teacher.findFirst();

    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        classId,
        sectionId,
        subjectId,
        teacherId: teacher?.id || '',
        dueDate: new Date(dueDate),
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
        submissions: true,
      },
    });

    return NextResponse.json({ success: true, homework });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

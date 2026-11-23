import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    const where: any = {};
    if (classId) where.classId = classId;

    const timetables = await prisma.timetable.findMany({
      where,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
      orderBy: { startTime: 'asc' },
    });

    const classes = await prisma.class.findMany({
      include: { sections: true, classSubjects: { include: { subject: true } } },
      orderBy: { numericGrade: 'asc' },
    });

    const teachers = await prisma.teacher.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
    });

    return NextResponse.json({ success: true, timetables, classes, teachers });
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

    const { classId, sectionId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNumber } =
      await request.json();

    const timetable = await prisma.timetable.create({
      data: {
        classId,
        sectionId,
        subjectId,
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        roomNumber: roomNumber || 'Room 101',
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
    });

    return NextResponse.json({ success: true, timetable });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

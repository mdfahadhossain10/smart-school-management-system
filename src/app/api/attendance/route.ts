import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const dateStr = searchParams.get('date');

    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const where: any = {};
    if (classId) where.classId = classId;

    const students = await prisma.student.findMany({
      where,
      include: {
        class: true,
        section: true,
        attendances: {
          where: {
            date: {
              gte: date,
              lt: nextDate,
            },
          },
        },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized to mark attendance' }, { status: 403 });
    }

    const { records, date: dateStr } = await request.json();

    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(8, 0, 0, 0);

    // Upsert each attendance record
    const results = [];
    for (const rec of records) {
      // Find existing
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: rec.studentId,
          date: date,
        },
      });

      if (existing) {
        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: { status: rec.status, remarks: rec.remarks || null },
        });
        results.push(updated);
      } else {
        const created = await prisma.attendance.create({
          data: {
            studentId: rec.studentId,
            date: date,
            status: rec.status,
            remarks: rec.remarks || null,
          },
        });
        results.push(created);
      }
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

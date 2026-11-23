import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: true,
        classTeacher: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { students: true } },
      },
      orderBy: { numericGrade: 'asc' },
    });

    const teachers = await prisma.teacher.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({ success: true, classes, teachers });
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

    const { name, numericGrade, capacity, classTeacherId, sectionNames } = await request.json();

    const createdClass = await prisma.class.create({
      data: {
        name,
        numericGrade: parseInt(numericGrade) || 1,
        capacity: parseInt(capacity) || 40,
        classTeacherId: classTeacherId || null,
        sections: {
          create: (sectionNames || ['A', 'B']).map((secName: string, idx: number) => ({
            name: secName,
            roomNumber: `Room ${numericGrade}0${idx + 1}`,
            capacity: 25,
          })),
        },
      },
      include: {
        sections: true,
        classTeacher: true,
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json({ success: true, class: createdClass });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

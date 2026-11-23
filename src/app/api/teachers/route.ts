import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department');

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { teacherId: { contains: search } },
        { department: { contains: search } },
      ];
    }
    if (department && department !== 'ALL') {
      where.department = department;
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        managedClasses: { select: { id: true, name: true } },
        assignedSubjects: { include: { subject: true, class: true } },
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({ success: true, teachers });
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

    const data = await request.json();
    const count = await prisma.teacher.count();
    const teacherId = `TCH-2026-${String(count + 1).padStart(3, '0')}`;

    const teacher = await prisma.teacher.create({
      data: {
        teacherId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender || 'Female',
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        designation: data.designation || 'Instructor',
        qualification: data.qualification || 'M.Sc.',
        department: data.department || 'Science',
        salary: parseFloat(data.salary) || 5000.0,
        status: 'ACTIVE',
        avatar: data.avatar || `https://images.unsplash.com/photo-${1534528741775 + count * 100}?w=150`,
      },
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

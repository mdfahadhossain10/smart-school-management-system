import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { rollNumber: { contains: search } },
        { admissionNumber: { contains: search } },
        { studentId: { contains: search } },
      ];
    }

    if (classId && classId !== 'ALL') {
      where.classId = classId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        parent: { select: { fatherName: true, phone: true } },
      },
      orderBy: { rollNumber: 'asc' },
    });

    const classes = await prisma.class.findMany({
      include: { sections: true },
      orderBy: { numericGrade: 'asc' },
    });

    return NextResponse.json({ success: true, students, classes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized to add students' }, { status: 403 });
    }

    const data = await request.json();

    const count = await prisma.student.count();
    const studentId = `STD-2026-${String(count + 1).padStart(3, '0')}`;
    const admissionNumber = `ADM-2026-${String(count + 100).padStart(3, '0')}`;

    const student = await prisma.student.create({
      data: {
        studentId,
        admissionNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender || 'Male',
        dob: new Date(data.dob || '2010-01-01'),
        bloodGroup: data.bloodGroup || 'O+',
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        rollNumber: data.rollNumber || String(1000 + count + 1),
        classId: data.classId,
        sectionId: data.sectionId,
        status: 'ACTIVE',
        avatar: data.avatar || `https://images.unsplash.com/photo-${1500000000000 + (count % 10) * 1000}?w=150`,
      },
      include: {
        class: true,
        section: true,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        class: true,
        section: true,
        parent: true,
        attendances: { orderBy: { date: 'desc' }, take: 30 },
        examResults: {
          include: { exam: true, subject: true },
          orderBy: { createdAt: 'desc' },
        },
        feeInvoices: {
          include: { feeType: true, payments: true },
          orderBy: { dueDate: 'desc' },
        },
        bookIssues: {
          include: { book: true },
          orderBy: { issueDate: 'desc' },
        },
        transports: {
          include: { route: { include: { vehicle: true } } },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();

    const updated = await prisma.student.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dob: data.dob ? new Date(data.dob) : undefined,
        bloodGroup: data.bloodGroup,
        email: data.email,
        phone: data.phone,
        address: data.address,
        rollNumber: data.rollNumber,
        classId: data.classId,
        sectionId: data.sectionId,
        status: data.status,
      },
      include: { class: true, section: true },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Student removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

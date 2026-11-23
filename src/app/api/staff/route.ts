import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        leaves: { orderBy: { createdAt: 'desc' } },
        payrolls: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { firstName, lastName, roleType, department, email, phone, salary } =
      await request.json();

    const count = await prisma.staff.count();
    const staffId = `STF-2026-${String(count + 1).padStart(3, '0')}`;

    const staffMember = await prisma.staff.create({
      data: {
        staffId,
        firstName,
        lastName,
        roleType: roleType || 'ADMINISTRATIVE',
        department: department || 'Operations',
        email: email || null,
        phone,
        salary: parseFloat(salary) || 3500.0,
        status: 'ACTIVE',
      },
      include: { leaves: true, payrolls: true },
    });

    return NextResponse.json({ success: true, staffMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

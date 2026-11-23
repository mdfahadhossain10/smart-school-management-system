import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, users });
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

    const { email, name, role, password, phone } = await request.json();

    const hashedPassword = await hashPassword(password || 'Password@123');

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        role,
        password: hashedPassword,
        phone: phone || null,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

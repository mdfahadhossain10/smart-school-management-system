import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, newPassword } = await request.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (newPassword && newPassword.length >= 6) {
      updateData.password = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

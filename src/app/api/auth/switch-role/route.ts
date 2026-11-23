import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    const user = await prisma.user.findFirst({
      where: { role },
    });

    if (!user) {
      return NextResponse.json({ error: `No user found with role ${role}` }, { status: 404 });
    }

    const sessionPayload = {
      id: user.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      avatar: user.avatar,
    };

    const token = await createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}

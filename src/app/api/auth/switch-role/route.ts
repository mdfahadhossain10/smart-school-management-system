import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionToken, Role } from '@/lib/auth';

const ROLE_DEMO_USERS: Record<Role, { name: string; email: string }> = {
  SUPER_ADMIN: { name: 'Alexander Wright', email: 'superadmin@smartacademy.edu' },
  SCHOOL_ADMIN: { name: 'Eleanor Vance', email: 'schooladmin@smartacademy.edu' },
  PRINCIPAL: { name: 'Dr. Arthur Pendelton', email: 'principal@smartacademy.edu' },
  TEACHER: { name: 'Sarah Jenkins', email: 'teacher@smartacademy.edu' },
  STUDENT: { name: 'Ethan Sterling', email: 'student@smartacademy.edu' },
  PARENT: { name: 'Robert Sterling', email: 'parent@smartacademy.edu' },
  ACCOUNTANT: { name: 'Franklin Hayes', email: 'accountant@smartacademy.edu' },
  LIBRARIAN: { name: 'Miriam Becker', email: 'librarian@smartacademy.edu' },
};

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    let user = null;
    try {
      user = await prisma.user.findFirst({
        where: { role },
      });
    } catch (dbErr) {
      console.warn('Switch role DB error, using fallback:', dbErr);
    }

    const fallback = ROLE_DEMO_USERS[role as Role] || {
      name: `${role.replace('_', ' ')} User`,
      email: `${role.toLowerCase()}@smartacademy.edu`,
    };

    const sessionPayload = {
      id: user?.id || `demo-${role.toLowerCase()}`,
      userId: user?.id || `demo-${role.toLowerCase()}`,
      email: user?.email || fallback.email,
      name: user?.name || fallback.name,
      role: role as any,
      avatar: user?.avatar || null,
    };

    const token = await createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
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

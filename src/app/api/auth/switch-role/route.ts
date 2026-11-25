import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionToken, Role } from '@/lib/auth';

const ROLE_DEMO_USERS: Record<Role, { name: string; email: string; avatar: string }> = {
  SUPER_ADMIN: { name: 'Fahad Fahim', email: 'superadmin@smartacademy.edu', avatar: '/avatars/fahad-fahim.jpg' },
  SCHOOL_ADMIN: { name: 'Fahad Hossain', email: 'schooladmin@smartacademy.edu', avatar: '/avatars/fahad-hossain.jpg' },
  PRINCIPAL: { name: 'Dr. Arthur Pendelton', email: 'principal@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  TEACHER: { name: 'Sarah Jenkins', email: 'teacher@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  STUDENT: { name: 'Ethan Sterling', email: 'student@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  PARENT: { name: 'Robert Sterling', email: 'parent@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  ACCOUNTANT: { name: 'Franklin Hayes', email: 'accountant@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  LIBRARIAN: { name: 'Miriam Becker', email: 'librarian@smartacademy.edu', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
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

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createSessionToken, Role } from '@/lib/auth';

const DEMO_FALLBACK_USERS: Record<string, { role: Role; name: string; pass: string }> = {
  'superadmin@smartacademy.edu': { role: 'SUPER_ADMIN', name: 'Alexander Wright', pass: 'Admin@123' },
  'schooladmin@smartacademy.edu': { role: 'SCHOOL_ADMIN', name: 'Eleanor Vance', pass: 'Admin@123' },
  'principal@smartacademy.edu': { role: 'PRINCIPAL', name: 'Dr. Arthur Pendelton', pass: 'Password@123' },
  'teacher@smartacademy.edu': { role: 'TEACHER', name: 'Sarah Jenkins', pass: 'Password@123' },
  'student@smartacademy.edu': { role: 'STUDENT', name: 'Ethan Sterling', pass: 'Password@123' },
  'parent@smartacademy.edu': { role: 'PARENT', name: 'Robert Sterling', pass: 'Password@123' },
  'accountant@smartacademy.edu': { role: 'ACCOUNTANT', name: 'Franklin Hayes', pass: 'Password@123' },
  'librarian@smartacademy.edu': { role: 'LIBRARIAN', name: 'Miriam Becker', pass: 'Password@123' },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try to authenticate against database
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn('Database query during login failed, checking fallback credentials:', dbErr);
    }

    if (user) {
      if (user.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Account is inactive or suspended. Contact administration.' },
          { status: 403 }
        );
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
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
          phone: user.phone,
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
    }

    // 2. Fallback check for known demo accounts (resilient to serverless/cloud cold starts)
    const demoUser = DEMO_FALLBACK_USERS[cleanEmail];
    if (demoUser && demoUser.pass === password) {
      const demoId = `demo-${demoUser.role.toLowerCase()}`;
      const sessionPayload = {
        id: demoId,
        userId: demoId,
        email: cleanEmail,
        name: demoUser.name,
        role: demoUser.role,
        avatar: null,
      };

      const token = await createSessionToken(sessionPayload);

      const response = NextResponse.json({
        success: true,
        user: {
          id: demoId,
          email: cleanEmail,
          name: demoUser.name,
          role: demoUser.role,
          avatar: null,
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
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}

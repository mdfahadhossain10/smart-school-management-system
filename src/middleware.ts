import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/token';

// Define route permissions for roles
const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/settings': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  '/users': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  '/teachers': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'],
  '/staff': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT'],
  '/fees': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PARENT', 'STUDENT'],
  '/payments': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'],
  '/library': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT'],
  '/transport': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, api auth endpoints, public assets, and login page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/forgot-password'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    if (pathname !== '/login') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based route permissions
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(session.role)) {
        return NextResponse.redirect(new URL('/dashboard?unauthorized=true', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};

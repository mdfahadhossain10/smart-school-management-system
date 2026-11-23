import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import {
  AuthSession,
  createSessionToken,
  verifySessionToken,
} from './token';

export type Role =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'ACCOUNTANT'
  | 'LIBRARIAN';

export type { AuthSession };
export { createSessionToken, verifySessionToken };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

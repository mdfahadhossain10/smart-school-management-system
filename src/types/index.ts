export type Role =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'ACCOUNTANT'
  | 'LIBRARIAN';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: string;
  children?: { name: string; href: string; roles: Role[] }[];
}

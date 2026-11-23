import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersClient from './UsersClient';

export const revalidate = 0;

export default async function UsersPage() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
    redirect('/dashboard');
  }

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
    orderBy: { createdAt: 'asc' },
  });

  return (
    <DashboardLayout user={session}>
      <UsersClient
        user={session}
        initialUsers={JSON.parse(JSON.stringify(users))}
      />
    </DashboardLayout>
  );
}

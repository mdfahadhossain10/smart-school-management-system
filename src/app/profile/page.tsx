import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileClient from './ProfileClient';

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      avatar: true,
      status: true,
      createdAt: true,
      studentProfile: { include: { class: true, section: true } },
      teacherProfile: true,
      parentProfile: true,
      staffProfile: true,
    },
  });

  return (
    <DashboardLayout user={session}>
      <ProfileClient
        user={session}
        userData={JSON.parse(JSON.stringify(user))}
      />
    </DashboardLayout>
  );
}

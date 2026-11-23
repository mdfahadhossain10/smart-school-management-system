import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeachersClient from './TeachersClient';

export const revalidate = 0;

export default async function TeachersPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const teachers = await prisma.teacher.findMany({
    include: {
      managedClasses: true,
      assignedSubjects: { include: { subject: true, class: true } },
    },
    orderBy: { firstName: 'asc' },
  });

  return (
    <DashboardLayout user={session}>
      <TeachersClient
        user={session}
        initialTeachers={JSON.parse(JSON.stringify(teachers))}
      />
    </DashboardLayout>
  );
}

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClassesClient from './ClassesClient';

export const revalidate = 0;

export default async function ClassesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [classes, teachers] = await Promise.all([
    prisma.class.findMany({
      include: {
        sections: true,
        classTeacher: true,
        _count: { select: { students: true } },
      },
      orderBy: { numericGrade: 'asc' },
    }),
    prisma.teacher.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <ClassesClient
        user={session}
        initialClasses={JSON.parse(JSON.stringify(classes))}
        teachers={JSON.parse(JSON.stringify(teachers))}
      />
    </DashboardLayout>
  );
}

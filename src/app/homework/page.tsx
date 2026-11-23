import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomeworkClient from './HomeworkClient';

export const revalidate = 0;

export default async function HomeworkPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [homeworks, classes] = await Promise.all([
    prisma.homework.findMany({
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
        submissions: { include: { student: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.class.findMany({
      include: { sections: true, classSubjects: { include: { subject: true } } },
      orderBy: { numericGrade: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <HomeworkClient
        user={session}
        initialHomeworks={JSON.parse(JSON.stringify(homeworks))}
        classes={JSON.parse(JSON.stringify(classes))}
      />
    </DashboardLayout>
  );
}

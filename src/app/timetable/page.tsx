import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TimetableClient from './TimetableClient';

export const revalidate = 0;

export default async function TimetablePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [classes, teachers, initialTimetables] = await Promise.all([
    prisma.class.findMany({
      include: {
        sections: true,
        classSubjects: { include: { subject: true } },
      },
      orderBy: { numericGrade: 'asc' },
    }),
    prisma.teacher.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.timetable.findMany({
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: true,
      },
      orderBy: { startTime: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <TimetableClient
        user={session}
        classes={JSON.parse(JSON.stringify(classes))}
        teachers={JSON.parse(JSON.stringify(teachers))}
        initialTimetables={JSON.parse(JSON.stringify(initialTimetables))}
      />
    </DashboardLayout>
  );
}

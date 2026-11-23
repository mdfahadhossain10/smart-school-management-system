import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AttendanceClient from './AttendanceClient';

export const revalidate = 0;

export default async function AttendancePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const classes = await prisma.class.findMany({
    include: { sections: true },
    orderBy: { numericGrade: 'asc' },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const initialStudents = await prisma.student.findMany({
    where: { classId: classes[0]?.id },
    include: {
      class: true,
      section: true,
      attendances: {
        where: {
          date: { gte: today, lt: tomorrow },
        },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  return (
    <DashboardLayout user={session}>
      <AttendanceClient
        user={session}
        classes={JSON.parse(JSON.stringify(classes))}
        initialStudents={JSON.parse(JSON.stringify(initialStudents))}
      />
    </DashboardLayout>
  );
}

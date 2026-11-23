import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExamsClient from './ExamsClient';

export const revalidate = 0;

export default async function ExamsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [exams, classes, results, settings] = await Promise.all([
    prisma.exam.findMany({
      include: {
        schedules: {
          include: {
            class: true,
            subject: true,
          },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    }),
    prisma.class.findMany({
      include: {
        sections: true,
        classSubjects: { include: { subject: true } },
        students: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
      },
      orderBy: { numericGrade: 'asc' },
    }),
    prisma.examResult.findMany({
      include: {
        exam: true,
        student: { include: { class: true } },
        subject: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
    prisma.schoolSettings.findFirst(),
  ]);

  return (
    <DashboardLayout user={session}>
      <ExamsClient
        user={session}
        initialExams={JSON.parse(JSON.stringify(exams))}
        classes={JSON.parse(JSON.stringify(classes))}
        initialResults={JSON.parse(JSON.stringify(results))}
        settings={JSON.parse(JSON.stringify(settings))}
      />
    </DashboardLayout>
  );
}

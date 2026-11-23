import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StudentDetailClient from './StudentDetailClient';

export const revalidate = 0;

export default async function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      section: true,
      parent: true,
      attendances: { orderBy: { date: 'desc' }, take: 15 },
      examResults: {
        include: { exam: true, subject: true },
        orderBy: { createdAt: 'desc' },
      },
      feeInvoices: {
        include: { feeType: true, payments: true },
        orderBy: { dueDate: 'desc' },
      },
      bookIssues: {
        include: { book: true },
        orderBy: { issueDate: 'desc' },
      },
      transports: {
        include: { route: { include: { vehicle: true } } },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const settings = await prisma.schoolSettings.findFirst();

  return (
    <DashboardLayout user={session}>
      <StudentDetailClient
        user={session}
        student={JSON.parse(JSON.stringify(student))}
        settings={JSON.parse(JSON.stringify(settings))}
      />
    </DashboardLayout>
  );
}

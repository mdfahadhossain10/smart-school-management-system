import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportsClient from './ReportsClient';

export const revalidate = 0;

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [classes, results, invoices, expenses] = await Promise.all([
    prisma.class.findMany({
      include: {
        students: true,
        sections: true,
        classTeacher: true,
      },
      orderBy: { numericGrade: 'asc' },
    }),
    prisma.examResult.findMany({
      include: {
        student: { include: { class: true } },
        subject: true,
        exam: true,
      },
      orderBy: { marksObtained: 'desc' },
    }),
    prisma.feeInvoice.findMany({
      include: {
        student: { include: { class: true } },
        feeType: true,
      },
    }),
    prisma.expense.findMany({
      orderBy: { date: 'desc' },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <ReportsClient
        user={session}
        classes={JSON.parse(JSON.stringify(classes))}
        results={JSON.parse(JSON.stringify(results))}
        invoices={JSON.parse(JSON.stringify(invoices))}
        expenses={JSON.parse(JSON.stringify(expenses))}
      />
    </DashboardLayout>
  );
}

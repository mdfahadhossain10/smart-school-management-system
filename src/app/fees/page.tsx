import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FeesClient from './FeesClient';

export const revalidate = 0;

export default async function FeesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [invoices, feeTypes, students, expenses, settings] = await Promise.all([
    prisma.feeInvoice.findMany({
      include: {
        student: { include: { class: true } },
        feeType: true,
        payments: { orderBy: { paymentDate: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.feeType.findMany(),
    prisma.student.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, rollNumber: true, class: { select: { name: true } } },
    }),
    prisma.expense.findMany({
      orderBy: { date: 'desc' },
      take: 20,
    }),
    prisma.schoolSettings.findFirst(),
  ]);

  return (
    <DashboardLayout user={session}>
      <FeesClient
        user={session}
        initialInvoices={JSON.parse(JSON.stringify(invoices))}
        feeTypes={JSON.parse(JSON.stringify(feeTypes))}
        students={JSON.parse(JSON.stringify(students))}
        initialExpenses={JSON.parse(JSON.stringify(expenses))}
        settings={JSON.parse(JSON.stringify(settings))}
      />
    </DashboardLayout>
  );
}

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StaffClient from './StaffClient';

export const revalidate = 0;

export default async function StaffPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const staff = await prisma.staff.findMany({
    include: {
      leaves: { orderBy: { createdAt: 'desc' } },
      payrolls: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { firstName: 'asc' },
  });

  return (
    <DashboardLayout user={session}>
      <StaffClient
        user={session}
        initialStaff={JSON.parse(JSON.stringify(staff))}
      />
    </DashboardLayout>
  );
}

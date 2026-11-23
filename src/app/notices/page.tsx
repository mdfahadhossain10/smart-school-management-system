import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NoticesClient from './NoticesClient';

export const revalidate = 0;

export default async function NoticesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <DashboardLayout user={session}>
      <NoticesClient
        user={session}
        initialNotices={JSON.parse(JSON.stringify(notices))}
      />
    </DashboardLayout>
  );
}

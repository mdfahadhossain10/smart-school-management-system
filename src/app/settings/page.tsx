import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
    redirect('/dashboard');
  }

  const settings = await prisma.schoolSettings.findFirst();

  return (
    <DashboardLayout user={session}>
      <SettingsClient
        user={session}
        initialSettings={JSON.parse(JSON.stringify(settings))}
      />
    </DashboardLayout>
  );
}

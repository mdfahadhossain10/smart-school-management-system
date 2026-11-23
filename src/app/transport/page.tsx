import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransportClient from './TransportClient';

export const revalidate = 0;

export default async function TransportPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const vehicles = await prisma.transportVehicle.findMany({
    include: {
      routes: {
        include: {
          students: { include: { student: { include: { class: true } } } },
        },
      },
    },
    orderBy: { vehicleNumber: 'asc' },
  });

  return (
    <DashboardLayout user={session}>
      <TransportClient
        user={session}
        initialVehicles={JSON.parse(JSON.stringify(vehicles))}
      />
    </DashboardLayout>
  );
}

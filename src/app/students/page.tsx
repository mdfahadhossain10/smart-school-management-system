import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StudentsClient from './StudentsClient';

export const revalidate = 0;

export default async function StudentsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [students, classes] = await Promise.all([
    prisma.student.findMany({
      include: {
        class: true,
        section: true,
        parent: true,
      },
      orderBy: { rollNumber: 'asc' },
    }),
    prisma.class.findMany({
      include: { sections: true },
      orderBy: { numericGrade: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <StudentsClient
        user={session}
        initialStudents={JSON.parse(JSON.stringify(students))}
        classes={JSON.parse(JSON.stringify(classes))}
      />
    </DashboardLayout>
  );
}

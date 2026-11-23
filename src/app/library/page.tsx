import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LibraryClient from './LibraryClient';

export const revalidate = 0;

export default async function LibraryPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [books, students] = await Promise.all([
    prisma.libraryBook.findMany({
      include: {
        issues: {
          where: { status: 'ISSUED' },
          include: { student: true },
        },
      },
      orderBy: { title: 'asc' },
    }),
    prisma.student.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, rollNumber: true },
    }),
  ]);

  return (
    <DashboardLayout user={session}>
      <LibraryClient
        user={session}
        initialBooks={JSON.parse(JSON.stringify(books))}
        students={JSON.parse(JSON.stringify(students))}
      />
    </DashboardLayout>
  );
}

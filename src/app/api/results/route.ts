import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function calculateGrade(marks: number, maxMarks: number = 100) {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
  if (percentage >= 80) return { grade: 'A', gpa: 3.7 };
  if (percentage >= 75) return { grade: 'B+', gpa: 3.3 };
  if (percentage >= 70) return { grade: 'B', gpa: 3.0 };
  if (percentage >= 60) return { grade: 'C', gpa: 2.0 };
  if (percentage >= 40) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { examId, studentId, subjectId, marksObtained, maxMarks, remarks } = await request.json();

    const parsedMarks = parseFloat(marksObtained);
    const parsedMax = parseFloat(maxMarks) || 100.0;
    const { grade, gpa } = calculateGrade(parsedMarks, parsedMax);

    const existing = await prisma.examResult.findFirst({
      where: { examId, studentId, subjectId },
    });

    let result;
    if (existing) {
      result = await prisma.examResult.update({
        where: { id: existing.id },
        data: {
          marksObtained: parsedMarks,
          maxMarks: parsedMax,
          grade,
          gpa,
          remarks: remarks || null,
        },
        include: { exam: true, student: true, subject: true },
      });
    } else {
      result = await prisma.examResult.create({
        data: {
          examId,
          studentId,
          subjectId,
          marksObtained: parsedMarks,
          maxMarks: parsedMax,
          grade,
          gpa,
          remarks: remarks || null,
        },
        include: { exam: true, student: true, subject: true },
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

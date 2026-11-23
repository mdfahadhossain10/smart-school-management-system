import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, notices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, content, targetAudience, isPinned } = await request.json();

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        targetAudience: targetAudience || 'ALL',
        publishedBy: session.name,
        isPinned: !!isPinned,
      },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

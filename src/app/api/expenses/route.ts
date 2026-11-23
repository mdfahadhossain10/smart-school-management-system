import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, category, amount, paymentMethod, description } = await request.json();
    const count = await prisma.expense.count();
    const receiptNumber = `EXP-2026-${String(count + 200).padStart(3, '0')}`;

    const expense = await prisma.expense.create({
      data: {
        title,
        category: category || 'Utilities',
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || 'BANK_TRANSFER',
        description: description || null,
        receiptNumber,
        recordedBy: session.name,
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

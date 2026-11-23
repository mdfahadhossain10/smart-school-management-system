import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;

    const invoices = await prisma.feeInvoice.findMany({
      where,
      include: {
        student: { select: { id: true, firstName: true, lastName: true, rollNumber: true, class: { select: { name: true } } } },
        feeType: true,
        payments: { orderBy: { paymentDate: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const feeTypes = await prisma.feeType.findMany();
    const students = await prisma.student.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, rollNumber: true, class: { select: { name: true } } },
    });

    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, invoices, feeTypes, students, expenses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { studentId, feeTypeId, amount, discountAmount, dueDate } = await request.json();

    const count = await prisma.feeInvoice.count();
    const invoiceNumber = `INV-2026-${String(count + 100).padStart(4, '0')}`;
    const parsedAmount = parseFloat(amount);
    const parsedDiscount = parseFloat(discountAmount) || 0;
    const dueAmount = Math.max(0, parsedAmount - parsedDiscount);

    const invoice = await prisma.feeInvoice.create({
      data: {
        invoiceNumber,
        studentId,
        feeTypeId,
        amount: parsedAmount,
        discountAmount: parsedDiscount,
        paidAmount: 0.0,
        dueAmount,
        dueDate: new Date(dueDate),
        status: 'UNPAID',
      },
      include: {
        student: true,
        feeType: true,
        payments: true,
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'PARENT', 'STUDENT'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { invoiceId, amount, paymentMethod, transactionId, notes } = await request.json();

    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const payAmount = parseFloat(amount);
    const count = await prisma.feePayment.count();
    const receiptNumber = `RCT-2026-${String(count + 500).padStart(4, '0')}`;

    // Create Payment Record
    const payment = await prisma.feePayment.create({
      data: {
        invoiceId,
        amount: payAmount,
        paymentMethod: paymentMethod || 'ONLINE',
        transactionId: transactionId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        receiptNumber,
        receivedBy: session.name,
        notes: notes || 'Processed via portal',
      },
    });

    // Update Invoice Balances
    const newPaidAmount = invoice.paidAmount + payAmount;
    const newDueAmount = Math.max(0, invoice.amount - invoice.discountAmount - newPaidAmount);
    const newStatus = newDueAmount <= 0 ? 'PAID' : 'PARTIAL';

    const updatedInvoice = await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status: newStatus,
      },
      include: {
        student: true,
        feeType: true,
        payments: true,
      },
    });

    return NextResponse.json({ success: true, payment, invoice: updatedInvoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await prisma.schoolSettings.findFirst();
    if (!settings) {
      settings = await prisma.schoolSettings.create({
        data: {
          schoolName: 'Smart Academy International',
          tagline: 'Inspiring Excellence, Fostering Innovation',
          address: '742 Evergreen Terrace, Springfield, OR',
          phone: '+1 (555) 839-2049',
          email: 'info@smartacademy.edu',
          website: 'https://smartacademy.edu',
          currency: 'USD',
          currencySymbol: '$',
          academicYear: '2026-2027',
        },
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    let settings = await prisma.schoolSettings.findFirst();

    if (settings) {
      settings = await prisma.schoolSettings.update({
        where: { id: settings.id },
        data: {
          schoolName: data.schoolName,
          tagline: data.tagline,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          currency: data.currency,
          currencySymbol: data.currencySymbol,
          academicYear: data.academicYear,
        },
      });
    } else {
      settings = await prisma.schoolSettings.create({ data });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const vehicles = await prisma.transportVehicle.findMany({
      include: {
        routes: {
          include: {
            students: { include: { student: true } },
          },
        },
      },
      orderBy: { vehicleNumber: 'asc' },
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { vehicleNumber, model, capacity, driverName, driverPhone, licenseNumber } =
      await request.json();

    const vehicle = await prisma.transportVehicle.create({
      data: {
        vehicleNumber,
        model,
        capacity: parseInt(capacity) || 30,
        driverName,
        driverPhone,
        licenseNumber: licenseNumber || null,
        status: 'ACTIVE',
      },
      include: { routes: true },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

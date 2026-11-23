'use client';

import React, { useState } from 'react';
import { Bus, Plus, Phone, User, MapPin, Clock, DollarSign } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';
import { Role } from '@/lib/auth';

interface TransportClientProps {
  user: { role: Role };
  initialVehicles: any[];
}

export default function TransportClient({
  user,
  initialVehicles,
}: TransportClientProps) {
  const { success, error } = useToast();
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: 'BUS-02',
    model: 'Tata Starbus Ultra (32 Seat)',
    capacity: '32',
    driverName: 'David Miller',
    driverPhone: '+1 555-0145',
    licenseNumber: 'CDL-OR-448291',
  });

  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register vehicle');

      setVehicles((prev) => [...prev, data.vehicle]);
      setIsAddVehicleOpen(false);
      success(`Vehicle ${data.vehicle.vehicleNumber} added to transport fleet.`);
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bus className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Transport Fleet & Routes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            School bus fleet management, driver registries, route stops, and transit assignments
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle to Fleet
          </button>
        )}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {v.vehicleNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    {v.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{v.model}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Capacity</span>
                <span className="text-base font-black text-slate-800 dark:text-slate-200">{v.capacity} Seats</span>
              </div>
            </div>

            {/* Driver Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{v.driverName}</span>
                  <span className="text-[10px] text-slate-400">License: {v.licenseNumber || 'CDL-Verified'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                {v.driverPhone}
              </div>
            </div>

            {/* Assigned Routes */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Operational Transit Routes
              </span>
              <div className="space-y-2">
                {v.routes?.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{r.routeName}</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(r.fare)} / mo</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{r.startPoint} ➔ {r.endPoint}</span>
                      <span>{r.pickupTime} - {r.dropTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Add Transit Vehicle"
        subtitle="Register school bus into institutional fleet"
      >
        <form onSubmit={handleCreateVehicle} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Tag / Number *
              </label>
              <input
                type="text"
                required
                value={vehicleForm.vehicleNumber}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Seating Capacity *
              </label>
              <input
                type="number"
                required
                value={vehicleForm.capacity}
                onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Model & Manufacturer *
            </label>
            <input
              type="text"
              required
              value={vehicleForm.model}
              onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designated Driver Name
              </label>
              <input
                type="text"
                required
                value={vehicleForm.driverName}
                onChange={(e) => setVehicleForm({ ...vehicleForm, driverName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Driver Phone *
              </label>
              <input
                type="text"
                required
                value={vehicleForm.driverPhone}
                onChange={(e) => setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

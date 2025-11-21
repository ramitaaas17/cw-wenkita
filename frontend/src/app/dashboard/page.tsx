// src/app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAppointments } from '@/src/hooks/useAppointments';
import Calendar from '@/src/components/dashboard/Calendar';
import CalendarModal from '@/src/components/dashboard/CalendarModal';
import DashboardHeader from '@/src/components/dashboard/DashboardHeader';
import UpcomingAppointments from '@/src/components/dashboard/UpcomingAppointments';
import type { Appointment } from '@/src/types';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);

  const {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    cancelAppointment,
  } = useAppointments();

  // 🔥 NUEVO: Recargar citas cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleDateClick = (date: Date, dayAppointments: Appointment[]) => {
    setSelectedDate(date);
    setSelectedDayAppointments(dayAppointments);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedDayAppointments([]);
  };

  const handleAppointmentCreated = () => {
    fetchAppointments();
  };

  const handleCancelAppointment = (id: number) => {
    cancelAppointment(id);
  };

  if (isLoading && appointments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        appointments={appointments} 
        onRefresh={fetchAppointments}
      />

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar 
              onDateClick={handleDateClick}
              appointments={appointments}
            />
          </div>

          <div className="lg:col-span-1">
            <UpcomingAppointments 
              appointments={appointments}
              onRefresh={fetchAppointments}
            />
          </div>
        </div>
      </div>

      <CalendarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        appointments={selectedDayAppointments}
        onAppointmentCreated={handleAppointmentCreated}
        onCancelAppointment={handleCancelAppointment}
      />
    </div>
  );
}
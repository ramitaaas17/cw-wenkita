// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Calendar from '../../components/dashboard/Calendar';
import CalendarModal from '../../components/dashboard/CalendarModal';
import UpcomingAppointments from '../../components/dashboard/UpcomingAppointments';
import { appointmentService } from '@/src/services/appointmentService';
import type { Appointment } from '@/src/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadAppointments = async () => {
    try {
      setError('');
      setIsLoadingAppointments(true);
      const data = await appointmentService.getAppointments();
      console.log('Citas cargadas:', data);
      setAppointments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las citas';
      console.error('Error al cargar citas:', errorMessage);
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  const handleDateClick = (date: Date, dayAppointments: Appointment[]) => {
    console.log('Fecha clickeada:', date, 'Citas:', dayAppointments);
    setSelectedDate(date);
    setSelectedDateAppointments(dayAppointments);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedDateAppointments([]);
  };

  const handleAppointmentCreated = async () => {
    console.log('Recargando citas después de crear/cancelar...');
    await loadAppointments();
    
    // Actualizar las citas de la fecha seleccionada si el modal está abierto
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const updatedDayAppointments = appointments.filter(apt => apt.fecha_cita === dateStr);
      setSelectedDateAppointments(updatedDayAppointments);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <DashboardHeader appointments={appointments} />

      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {isLoadingAppointments ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando calendario...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar 
                onDateClick={handleDateClick}
                appointments={appointments}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <UpcomingAppointments 
                  appointments={appointments}
                  onRefresh={loadAppointments}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CalendarModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        appointments={selectedDateAppointments}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </div>
  );
}
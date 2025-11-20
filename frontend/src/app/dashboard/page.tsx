// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Calendar from '../../components/dashboard/Calendar';
import CalendarModal from '../../components/dashboard/CalendarModal';
import UpcomingAppointments from '../../components/dashboard/UpcomingAppointments';
import type { Appointment } from '@/src/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clinica_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
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
    setSelectedDate(date);
    setSelectedDateAppointments(dayAppointments);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedDateAppointments([]);
  };

  const handleAppointmentCreated = () => {
    loadAppointments();
  };

  if (isLoading) {
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
    <div >
      {/* Header con estadísticas */}
      <DashboardHeader />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {isLoadingAppointments ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando calendario...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendario - Ocupa 2 columnas */}
            <div className="lg:col-span-2">
              <Calendar 
                onDateClick={handleDateClick}
                appointments={appointments}
              />
            </div>

            {/* Próximas Citas - Ocupa 1 columna */}
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

      {/* Modal para crear/ver citas */}
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
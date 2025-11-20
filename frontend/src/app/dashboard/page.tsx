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
import { API_ENDPOINTS, fetchWithAuth } from '@/src/lib/api';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadAppointments = async () => {
    try {
      setError('');
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.list);

      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }

      const data = await response.json();
      setAppointments(data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('No se pudieron cargar las citas. Por favor, intenta de nuevo.');
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
    <div>
      {/* Header con estadísticas */}
      <DashboardHeader />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
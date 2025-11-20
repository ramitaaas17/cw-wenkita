// components/dashboard/CalendarModal.tsx
'use client';

import { useState, useEffect } from 'react';
import AppointmentForm from './appointment/AppointmentForm';
import AppointmentCard from './appointment/AppointmentCard';
import { appointmentService } from '@/src/services/appointmentService';
import type { Appointment, CreateAppointmentRequest } from '@/src/types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  appointments: Appointment[];
  onAppointmentCreated: () => void;
}

export default function CalendarModal({
  isOpen,
  onClose,
  selectedDate,
  appointments,
  onAppointmentCreated,
}: CalendarModalProps) {
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && selectedDate) {
      setError('');
      setShowSuccess(false);
      setMode(appointments.length === 0 ? 'create' : 'view');
    }
  }, [isOpen, selectedDate, appointments.length]);

  useEffect(() => {
    if (!isOpen) {
      setMode('view');
      setShowSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (formData: CreateAppointmentRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await appointmentService.createAppointment(formData);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setMode('view');
        onAppointmentCreated();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agendar la cita';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    setCancellingId(id);
    try {
      await appointmentService.cancelAppointment(id);
      onAppointmentCreated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la cita';
      setError(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white capitalize">
              {formatDate(selectedDate)}
            </h2>
            <p className="text-blue-100 mt-1">
              {mode === 'view' ? `${appointments.length} cita(s) agendada(s)` : 'Agendar nueva cita'}
            </p>
          </div>

          <div className="p-8">
            {mode === 'view' && appointments.length > 0 ? (
              <>
                <div className="space-y-4 mb-6">
                  {appointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      isLoading={cancellingId === appointment.id}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setMode('create')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agendar otra cita este dia
                </button>
              </>
            ) : (
              <>
                {showSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-800">Cita agendada exitosamente!</p>
                      <p className="text-sm text-green-700">Te enviaremos una confirmacion por correo</p>
                    </div>
                  </div>
                )}

                <AppointmentForm
                  selectedDate={selectedDate}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                />

                {appointments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMode('view')}
                    className="mt-4 w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Ver Citas
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
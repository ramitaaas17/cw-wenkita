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
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await onAppointmentCreated();
      
      setShowSuccess(false);
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agendar la cita';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    setCancellingId(id);
    setError('');
    
    try {
      await appointmentService.cancelAppointment(id);
      
      await onAppointmentCreated();
      
      const remainingAppointments = appointments.filter(apt => 
        apt.id !== id && apt.estado !== 'cancelada'
      );
      
      if (remainingAppointments.length === 0) {
        setMode('create');
      }
      
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
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all z-10 group"
          >
            <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 px-8 py-8 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">
                  {formatDate(selectedDate)}
                </h2>
                <p className="text-blue-100 text-sm mt-0.5">
                  {mode === 'view' ? `${appointments.length} cita(s) agendada(s)` : 'Agendar nueva cita'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

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
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agendar otra cita
                </button>
              </>
            ) : (
              <>
                {showSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-800">Cita agendada exitosamente</p>
                      <p className="text-sm text-emerald-700">Actualizando calendario...</p>
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
                    className="mt-5 w-full py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    Ver Citas del Día
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
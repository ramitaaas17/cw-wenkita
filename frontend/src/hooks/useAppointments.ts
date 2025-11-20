
import { useState, useCallback } from 'react';
import { appointmentService } from '@/src/services/appointmentService';
import type { Appointment, CreateAppointmentRequest } from '@/src/types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar las citas';
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData: CreateAppointmentRequest) => {
    setError('');
    try {
      const data = await appointmentService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo crear la cita';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const cancelAppointment = useCallback(async (id: number) => {
    setError('');
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo cancelar la cita';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const confirmAppointment = useCallback(async (id: number) => {
    setError('');
    try {
      await appointmentService.confirmAppointment(id);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === id ? { ...apt, estado: 'confirmada' } : apt
        )
      );
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo confirmar la cita';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    confirmAppointment,
  };
}
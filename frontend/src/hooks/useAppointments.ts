// hooks/useAppointments.ts
import { useState, useCallback, useEffect } from 'react';
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

  // Cargar citas al montar el componente
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = useCallback(async (appointmentData: CreateAppointmentRequest) => {
    setError('');
    try {
      await appointmentService.createAppointment(appointmentData);
      // Recargar todas las citas después de crear
      fetchAppointments();
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo crear la cita';
      setError(errorMessage);
      throw err;
    }
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(async (id: number) => {
    setError('');
    try {
      await appointmentService.cancelAppointment(id);
      // Actualizar el estado local inmediatamente
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === id ? { ...apt, estado: 'cancelada' } : apt
        )
      );
      // Recargar para asegurar sincronización
      await fetchAppointments();
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo cancelar la cita';
      setError(errorMessage);
      throw err;
    }
  }, [fetchAppointments]);

  const confirmAppointment = useCallback(async (id: number) => {
    setError('');
    try {
      await appointmentService.confirmAppointment(id);
      // Actualizar el estado local inmediatamente
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === id ? { ...apt, estado: 'confirmada' } : apt
        )
      );
      // Recargar para asegurar sincronización
      await fetchAppointments();
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo confirmar la cita';
      setError(errorMessage);
      throw err;
    }
  }, [fetchAppointments]);

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
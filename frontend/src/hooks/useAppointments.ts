// frontend/src/hooks/useAppointments.ts

import { useState, useCallback } from 'react';
import type { Appointment } from '@/src/types';
import { API_ENDPOINTS, fetchWithAuth } from '@/src/lib/api';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.list);

      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }

      const data = await response.json();
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Error loading appointments:', err);
      setError(err.message || 'No se pudieron cargar las citas');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'created_at'>) => {
    setError('');
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.create, {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la cita');
      }

      const data = await response.json();
      setAppointments(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'No se pudo crear la cita');
      throw err;
    }
  }, []);

  const updateAppointment = useCallback(async (id: number, appointmentData: Partial<Appointment>) => {
    setError('');
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.update(id), {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la cita');
      }

      const data = await response.json();
      setAppointments(prev => prev.map(apt => apt.id === id ? data : apt));
      return data;
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.message || 'No se pudo actualizar la cita');
      throw err;
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number) => {
    setError('');
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.delete(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la cita');
      }

      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err: any) {
      console.error('Error deleting appointment:', err);
      setError(err.message || 'No se pudo eliminar la cita');
      throw err;
    }
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
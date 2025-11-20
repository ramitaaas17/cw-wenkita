// services/appointmentService.ts

import { API_ENDPOINTS, fetchWithAuth, parseApiResponse, handleApiError } from '@/src/lib/api';
import type { Appointment, CreateAppointmentRequest, ApiError } from '@/src/types';

class AppointmentService {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.list);

      if (!response.ok) {
        const error = await parseApiResponse(response);
        throw new Error(error?.error || 'Error al obtener citas');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createAppointment(appointment: CreateAppointmentRequest): Promise<Appointment> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.create, {
        method: 'POST',
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        const error = await parseApiResponse(response);
        throw new Error(error?.error || 'Error al crear la cita');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.getById(id));

      if (!response.ok) {
        const error = await parseApiResponse(response);
        throw new Error(error?.error || 'Cita no encontrada');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async confirmAppointment(id: number): Promise<void> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.confirm(id), {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await parseApiResponse(response);
        throw new Error(error?.error || 'Error al confirmar la cita');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async cancelAppointment(id: number): Promise<void> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.appointments.cancel(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await parseApiResponse(response);
        throw new Error(error?.error || 'Error al cancelar la cita');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const appointmentService = new AppointmentService();
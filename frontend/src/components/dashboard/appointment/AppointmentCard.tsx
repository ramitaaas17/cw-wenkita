// components/dashboard/appointment/AppointmentCard.tsx
'use client';

import type { Appointment } from '@/src/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export default function AppointmentCard({
  appointment,
  onCancel,
  isLoading = false,
}: AppointmentCardProps) {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusStyles = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (estado: string) => {
    const labels: Record<string, string> = {
      programada: 'Programada',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      completada: 'Completada',
      en_curso: 'En Curso',
      no_asistio: 'No Asistio',
    };
    return labels[estado] || estado;
  };

  const handleCancel = async () => {
    if (!onCancel || !window.confirm('Confirma que deseas cancelar esta cita?')) {
      return;
    }
    await onCancel(appointment.id);
  };

  const canBeCancelled = appointment.estado !== 'cancelada' && appointment.estado !== 'completada';

  return (
    <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">
            {appointment.servicio}
          </h3>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(appointment.hora_cita)}
          </p>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {appointment.fecha_cita}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(appointment.estado)}`}>
          {getStatusLabel(appointment.estado)}
        </span>
      </div>

      {appointment.email && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {appointment.email}
          </p>
        </div>
      )}

      {appointment.mensaje && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> {appointment.mensaje}
          </p>
        </div>
      )}

      {canBeCancelled && (
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="mt-4 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cancelando...' : 'Cancelar Cita'}
        </button>
      )}
    </div>
  );
}
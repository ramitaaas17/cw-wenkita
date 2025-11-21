// components/dashboard/UpcomingAppointments.tsx
'use client';

import { ReactElement } from 'react';
import type { Appointment } from '@/src/types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

export default function UpcomingAppointments({ appointments, onRefresh }: UpcomingAppointmentsProps) {
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const cleanDate = dateString.split('T')[0];
    const date = new Date(cleanDate + 'T00:00:00');
    
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const activeAppointments = appointments
    .filter(apt => apt.estado === 'confirmada' || apt.estado === 'programada')
    .sort((a, b) => {
      const cleanDateA = a.fecha_cita.split('T')[0];
      const cleanDateB = b.fecha_cita.split('T')[0];
      const dateA = new Date(cleanDateA + 'T' + a.hora_cita);
      const dateB = new Date(cleanDateB + 'T' + b.hora_cita);
      return dateA.getTime() - dateB.getTime();
    });

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const statusColors = {
      confirmada: 'bg-green-100 text-green-700 border-green-200',
      programada: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return (
      <div className="group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-cyan-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-gray-800 truncate">
                {appointment.servicio}
              </h3>
              <span className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium border ${
                statusColors[appointment.estado as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
              }`}>
                {appointment.estado === 'confirmada' ? '✓ Confirmada' : '⏱ Pendiente'}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="capitalize">{formatDate(appointment.fecha_cita)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-800">{formatTime(appointment.hora_cita)}</span>
              </div>
            </div>

            {appointment.mensaje && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-2">
                  <span className="font-medium">Nota:</span> {appointment.mensaje}
                </p>
              </div>
            )}

            {appointment.estado === 'confirmada' && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Confirmada por el especialista</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
      <div className="bg-gradient-to-b from-slate-700 via-blue-800 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Próximas Citas</h2>
            <p className="text-cyan-100 text-sm mt-1">
              {activeAppointments.length} {activeAppointments.length === 1 ? 'consulta programada' : 'consultas programadas'}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm group"
            title="Actualizar citas"
          >
            <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        {activeAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No tienes citas programadas
            </h3>
            <p className="text-gray-500 text-sm">
              Selecciona un día en el calendario para agendar
            </p>
          </div>
        ) : (
          <>
            {activeAppointments.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
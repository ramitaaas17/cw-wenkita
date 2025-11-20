// components/dashboard/UpcomingAppointments.tsx
'use client';

import { useState, useEffect, ReactElement } from 'react';
import type { Appointment } from '@/src/types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

export default function UpcomingAppointments({ appointments, onRefresh }: UpcomingAppointmentsProps) {
  const [groupedAppointments, setGroupedAppointments] = useState<{
    today: Appointment[];
    tomorrow: Appointment[];
    thisWeek: Appointment[];
    later: Appointment[];
  }>({
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  });

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const grouped = {
      today: [] as Appointment[],
      tomorrow: [] as Appointment[],
      thisWeek: [] as Appointment[],
      later: [] as Appointment[]
    };

    appointments
      .filter(apt => apt.estado !== 'cancelada' && apt.estado !== 'completada')
      .sort((a, b) => {
        const dateA = new Date(a.fecha_cita + 'T' + a.hora_cita);
        const dateB = new Date(b.fecha_cita + 'T' + b.hora_cita);
        return dateA.getTime() - dateB.getTime();
      })
      .forEach(apt => {
        const aptDate = new Date(apt.fecha_cita + 'T00:00:00');
        
        if (aptDate.getTime() === today.getTime()) {
          grouped.today.push(apt);
        } else if (aptDate.getTime() === tomorrow.getTime()) {
          grouped.tomorrow.push(apt);
        } else if (aptDate >= tomorrow && aptDate < endOfWeek) {
          grouped.thisWeek.push(apt);
        } else if (aptDate >= endOfWeek) {
          grouped.later.push(apt);
        }
      });

    setGroupedAppointments(grouped);
  }, [appointments]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const AppointmentCard = ({ appointment, category }: { appointment: Appointment; category: string }) => {
    const colors = {
      today: 'from-blue-500 to-cyan-500',
      tomorrow: 'from-purple-500 to-pink-500',
      thisWeek: 'from-emerald-500 to-teal-500',
      later: 'from-orange-500 to-amber-500'

    };

    return (
      <div className="group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-transparent hover:shadow-lg transition-all duration-300">
        {/* Gradient border on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${colors[category as keyof typeof colors]} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm`}></div>
        
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`shrink-0 w-12 h-12 rounded-xl ${colors[category as keyof typeof colors]} flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-gray-800 truncate">
                {appointment.servicio}
              </h3>
              <span className={`shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${
                appointment.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {appointment.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
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
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 line-clamp-2">
                  {appointment.mensaje}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, appointments, category, icon }: { title: string; appointments: Appointment[]; category: string; icon: ReactElement }) => {
    if (appointments.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            {appointments.length}
          </span>
        </div>
        <div className="space-y-3">
          {appointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} category={category} />
          ))}
        </div>
      </div>
    );
  };

  const totalAppointments = Object.values(groupedAppointments).flat().length;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Próximas Citas</h2>
            <p className="text-purple-100 text-sm mt-1">
              {totalAppointments} {totalAppointments === 1 ? 'consulta programada' : 'consultas programadas'}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
        {totalAppointments === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <Section
              title="Hoy"
              appointments={groupedAppointments.today}
              category="today"
              icon={
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <Section
              title="Mañana"
              appointments={groupedAppointments.tomorrow}
              category="tomorrow"
              icon={
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
            />
            <Section
              title="Esta Semana"
              appointments={groupedAppointments.thisWeek}
              category="thisWeek"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <Section
              title="Próximamente"
              appointments={groupedAppointments.later}
              category="later"
              icon={
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
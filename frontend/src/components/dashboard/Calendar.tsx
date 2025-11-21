// components/dashboard/Calendar.tsx
'use client';

import { useState } from 'react';
import type { Appointment } from '@/src/types';

interface CalendarProps {
  onDateClick: (date: Date, appointments: Appointment[]) => void;
  appointments: Appointment[];
}

export default function Calendar({ onDateClick, appointments }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return appointments.filter(apt => {
      const cleanDate = apt.fecha_cita.split('T')[0];
      return cleanDate === dateStr && apt.estado !== 'cancelada';
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1: Date, date2: Date | null): boolean => {
    if (!date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    const dayAppointments = getAppointmentsForDate(clickedDate);
    onDateClick(clickedDate, dayAppointments);
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = getAppointmentsForDate(date);
      const hasAppointments = dayAppointments.length > 0;
      const today = isToday(date);
      const selected = isSameDay(date, selectedDate);
      const isPast = date < new Date() && !today;

      const confirmedCount = dayAppointments.filter(apt => apt.estado === 'confirmada').length;
      const programmedCount = dayAppointments.filter(apt => apt.estado === 'programada').length;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`
            group relative aspect-square p-2 rounded-xl transition-all duration-200
            flex flex-col items-center justify-center
            ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}
            ${selected && !today ? 'bg-blue-50 ring-2 ring-blue-500' : ''}
          `}
        >
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-lg transition-all
            ${today ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-500/30' : ''}
            ${selected && !today ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
            ${!today && !selected ? 'text-slate-700 group-hover:bg-slate-100' : ''}
          `}>
            <span className="text-sm">{day}</span>
          </div>
          
          {hasAppointments && (
            <div className="absolute bottom-1.5 flex gap-1">
              {confirmedCount > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" 
                     title={`${confirmedCount} confirmada(s)`}
                />
              )}
              {programmedCount > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"
                     title={`${programmedCount} programada(s)`}
                />
              )}
              {dayAppointments.length > 2 && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
          )}

          {dayAppointments.length > 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
              {dayAppointments.length}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Selecciona un día para agendar o ver citas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
            aria-label="Mes anterior"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Hoy
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
            aria-label="Mes siguiente"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-7 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-600 py-2 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">Programada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">Hoy</span>
        </div>
      </div>
    </div>
  );
}
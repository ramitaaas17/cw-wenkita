// components/dashboard/Calendar.tsx
'use client';

import { useState, useEffect } from 'react';
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
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.fecha_cita === dateStr);
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

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = getAppointmentsForDate(date);
      const hasAppointments = dayAppointments.length > 0;
      const today = isToday(date);
      const selected = isSameDay(date, selectedDate);
      const isPast = date < new Date() && !today;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`
            group relative aspect-square p-3 rounded-lg transition-all duration-150
            flex flex-col items-center justify-center
            ${isPast ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
            ${today ? '' : ''}
            ${selected && !today ? 'bg-blue-50' : ''}
          `}
        >
          {/* Day number with pill background for today */}
          <div className={`
            flex items-center justify-center w-9 h-9 rounded-full transition-all
            ${today ? 'bg-blue-500 text-white font-semibold' : ''}
            ${selected && !today ? 'bg-blue-100 text-blue-700 font-medium' : ''}
            ${!today && !selected ? 'text-gray-700 group-hover:bg-gray-100' : ''}
          `}>
            <span className="text-sm">
              {day}
            </span>
          </div>
          
          {/* Appointment indicators - dots below number */}
          {hasAppointments && (
            <div className="absolute bottom-2 flex gap-1">
              {dayAppointments.slice(0, 3).map((apt, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full ${
                    apt.estado === 'completada' ? 'bg-green-500' :
                    apt.estado === 'programada' ? 'bg-amber-500' :
                    'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Selecciona un día para agendar o ver citas
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Mes anterior"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors mx-1"
          >
            Hoy
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Mes siguiente"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar body */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Completada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-600">Programada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Hoy</span>
        </div>
      </div>
    </div>
  );
}
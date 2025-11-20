// components/dashboard/CalendarModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import type { Appointment } from '@/src/types';
import { services } from '@/src/constants/services';

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
  onAppointmentCreated
}: CalendarModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Appointment>>({
    nombre_paciente: `${user?.nombre} ${user?.apellido}` || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    servicio: '',
    fecha_cita: '',
    hora_cita: '',
    mensaje: '',
  });

  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, fecha_cita: dateStr }));
      
      if (appointments.length === 0) {
        setMode('create');
      } else {
        setMode('view');
      }
    }
  }, [isOpen, selectedDate, appointments]);

  useEffect(() => {
    if (!isOpen) {
      setMode('view');
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        nombre_paciente: `${user?.nombre} ${user?.apellido}` || '',
        telefono: user?.telefono || '',
        email: user?.email || '',
        servicio: '',
        fecha_cita: selectedDate?.toISOString().split('T')[0] || '',
        hora_cita: '',
        mensaje: '',
      });

      onAppointmentCreated();
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clinica_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la cita');
      }

      onAppointmentCreated();
      onClose();
    } catch (err) {
      alert('Error al cancelar la cita');
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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-3xl">
            <h2 className="text-2xl font-bold text-white capitalize">
              {formatDate(selectedDate)}
            </h2>
            <p className="text-blue-100 mt-1">
              {mode === 'view' ? `${appointments.length} cita(s) agendada(s)` : 'Agendar nueva cita'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {mode === 'view' && appointments.length > 0 ? (
              <>
                {/* View appointments */}
                <div className="space-y-4 mb-6">
                  {appointments.map(appointment => (
                    <div
                      key={appointment.id}
                      className="border-2 border-gray-200 rounded-2xl p-5 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {appointment.servicio}
                          </h3>
                          <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(appointment.hora_cita)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                          appointment.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.estado === 'confirmada' ? 'Confirmada' :
                           appointment.estado === 'pendiente' ? 'Pendiente' : 'Completada'}
                        </span>
                      </div>

                      {appointment.mensaje && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Nota:</strong> {appointment.mensaje}
                          </p>
                        </div>
                      )}

                      {appointment.estado !== 'cancelada' && appointment.estado !== 'completada' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id!)}
                          className="mt-4 w-full px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                        >
                          Cancelar Cita
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Button to create another appointment */}
                <button
                  onClick={() => setMode('create')}
                  className="w-full py-4 bg-linear-to-br from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agendar otra cita este día
                </button>
              </>
            ) : (
              <>
                {/* Create appointment form */}
                {success && (
                  <div className="mb-6 p-4 bg-linear-to-br from-green-500 to-emerald-500 text-white rounded-2xl flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">¡Cita agendada exitosamente!</p>
                      <p className="text-sm text-green-100">Te enviaremos una confirmación</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-500 text-white rounded-2xl flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Servicio Médico
                    </label>
                    <select
                      name="servicio"
                      value={formData.servicio}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    >
                      <option value="">Selecciona un servicio</option>
                      {services.map(service => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hora de la Cita
                    </label>
                    <input
                      name="hora_cita"
                      type="time"
                      value={formData.hora_cita}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensaje o Síntomas <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                      placeholder="Describe brevemente el motivo de tu consulta..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    {appointments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMode('view')}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Ver Citas
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-linear-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Agendando...
                        </span>
                      ) : (
                        'Agendar Cita'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// components/dashboard/appointment/AppointmentForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { services } from '@/src/constants/services';
import type { CreateAppointmentRequest } from '@/src/types';

interface AppointmentFormProps {
  selectedDate: Date;
  onSubmit: (data: CreateAppointmentRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export default function AppointmentForm({
  selectedDate,
  onSubmit,
  isLoading = false,
  error = '',
}: AppointmentFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    nombre_paciente: `${user?.nombre} ${user?.apellido}`.trim() || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    servicio: '',
    fecha_cita: selectedDate.toISOString().split('T')[0],
    hora_cita: '',
    mensaje: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!error) {
      setFormData(prev => ({
        ...prev,
        servicio: '',
        hora_cita: '',
        mensaje: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre Paciente
          </label>
          <input
            type="text"
            name="nombre_paciente"
            value={formData.nombre_paciente}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="Juan Perez"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo Electronico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Telefono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="555-123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Servicio Medico
          </label>
          <select
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          >
            <option value="">Selecciona un servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hora de la Cita
          </label>
          <input
            type="time"
            name="hora_cita"
            value={formData.hora_cita}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha de la Cita
          </label>
          <input
            type="date"
            value={formData.fecha_cita}
            onChange={(e) => setFormData(prev => ({ ...prev, fecha_cita: e.target.value }))}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mensaje o Sintomas (Opcional)
        </label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
          placeholder="Describe brevemente el motivo de tu consulta..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </form>
  );
}
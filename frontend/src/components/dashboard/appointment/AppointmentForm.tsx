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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombre_paciente"
            value={formData.nombre_paciente}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="555-123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Servicio Médico
          </label>
          <select
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha_cita}
            onChange={(e) => setFormData(prev => ({ ...prev, fecha_cita: e.target.value }))}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Hora
          </label>
          <input
            type="time"
            name="hora_cita"
            value={formData.hora_cita}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Motivo de Consulta
          <span className="text-slate-400 font-normal ml-1">(Opcional)</span>
        </label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
          placeholder="Describe brevemente el motivo de tu consulta..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Agendando cita...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agendar Cita
          </span>
        )}
      </button>
    </form>
  );
}
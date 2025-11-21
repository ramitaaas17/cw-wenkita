// app/appointments/confirm/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { appointmentService } from '@/src/services/appointmentService';

export default function ConfirmAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  useEffect(() => {
    const confirmAppointment = async () => {
      try {
        const id = parseInt(params.id as string);
        
        if (isNaN(id)) {
          setStatus('error');
          setMessage('ID de cita inválido');
          return;
        }

        // Primero obtener los detalles de la cita
        const appointment = await appointmentService.getAppointmentById(id);
        setAppointmentDetails(appointment);

        // Si ya está confirmada, mostrar mensaje
        if (appointment.estado === 'confirmada') {
          setStatus('success');
          setMessage('Esta cita ya ha sido confirmada previamente');
          return;
        }

        // Confirmar la cita
        await appointmentService.confirmAppointment(id);
        
        setStatus('success');
        setMessage('¡Cita confirmada exitosamente!');
      } catch (error) {
        console.error('Error al confirmar cita:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error al confirmar la cita');
      }
    };

    confirmAppointment();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {status === 'loading' && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirmando cita...
            </h2>
            <p className="text-gray-600">Por favor espera un momento</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Cita Confirmada!
              </h1>
              <p className="text-green-50 text-lg">
                {message}
              </p>
            </div>

            {/* Detalles de la cita */}
            {appointmentDetails && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Detalles de tu cita:
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Paciente</p>
                      <p className="text-gray-900 font-semibold">{appointmentDetails.nombre_paciente}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tratamiento</p>
                      <p className="text-gray-900 font-semibold">{appointmentDetails.tratamiento}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Fecha y Hora</p>
                      <p className="text-gray-900 font-semibold capitalize">
                        {formatDate(appointmentDetails.fecha_hora)}
                      </p>
                      <p className="text-gray-700 mt-1">
                        {formatTime(appointmentDetails.fecha_hora)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Especialista</p>
                      <p className="text-gray-900 font-semibold">{appointmentDetails.nombre_especialista}</p>
                      <p className="text-gray-600 text-sm mt-1">{appointmentDetails.especialidad}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recordatorios importantes
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Llega 10 minutos antes de tu cita</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Trae tu identificación oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Si necesitas cancelar, hazlo con 24 horas de anticipación</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Error al Confirmar
              </h1>
              <p className="text-red-50 text-lg">
                {message}
              </p>
            </div>

            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                Por favor contacta con la clínica si el problema persiste
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
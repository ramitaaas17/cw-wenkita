// components/home/Services.tsx
'use client';

import ServiceCard from '../ui/ServiceCard';
import { services } from '@/src/constants/services';

export default function Services() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-slate-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-cyan-600">
              Servicios
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos atención médica integral con especialistas dedicados a tu bienestar y salud
          </p>
          
          {/* Línea decorativa */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-1 w-20 bg-gradient-to-r from-slate-700 to-blue-600 rounded-full"></div>
            <div className="h-2 w-2 bg-cyan-600 rounded-full mx-2"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
          </div>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            ¿Necesitas agendar una cita o más información?
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-700 to-cyan-600 text-white rounded-lg font-semibold text-lg hover:from-slate-800 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contáctanos ahora
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
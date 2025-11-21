// components/ui/ServiceCard.tsx
'use client';

import { Activity, Stethoscope, Scissors, Dumbbell, Smile, Footprints } from 'lucide-react';
import type { Service } from '@/src/types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const iconMap = {
  activity: Activity,
  stethoscope: Stethoscope,
  scissors: Scissors,
  dumbbell: Dumbbell,
  smile: Smile,
  footprints: Footprints,
};

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-blue-500',
  'from-rose-500 to-orange-500',
];

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon as keyof typeof iconMap];
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Gradiente decorativo de fondo */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Círculo decorativo animado */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ease-out`}
      />

      <div className="relative p-8">
        {/* Icono con animación */}
        <div
          className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}
        >
          {Icon && <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />}
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {service.name}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Botón con animación */}
        <button className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
          <span>Más información</span>
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>

      {/* Borde inferior con gradiente */}
      <div className={`h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </div>
  );
}
// components/home/About.tsx
'use client';

import { Heart, Award, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Cada paciente es único y merece un tratamiento individualizado y de calidad.',
  },
  {
    icon: Award,
    title: 'Profesionales Certificados',
    description: 'Contamos con especialistas altamente calificados y con años de experiencia.',
  },
  {
    icon: Users,
    title: 'Equipo Multidisciplinario',
    description: 'Trabajo en conjunto de diferentes especialidades para tu bienestar integral.',
  },
  {
    icon: Clock,
    title: 'Horarios Flexibles',
    description: 'Adaptamos nuestros horarios a tus necesidades para facilitar tu atención.',
  },
];

export default function About() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-cyan-600">
              Clínica Wenka?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos tu mejor opción en atención médica integral con más de 10 años de experiencia
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Lado izquierdo - Imagen decorativa */}
          <div className="relative">
            <div className="relative h-96 bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-cyan-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <Heart className="w-16 h-16 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Tu salud</h3>
                  <p className="text-xl text-gray-600">es nuestra prioridad</p>
                </div>
              </div>
              
              {/* Elementos decorativos flotantes */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-white/50 rounded-full animate-float"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/50 rounded-full animate-float animation-delay-2000"></div>
            </div>
          </div>

          {/* Lado derecho - Texto */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Comprometidos con tu bienestar
            </h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              En Clínica Wenka entendemos que tu salud es lo más importante. Por eso, hemos reunido 
              a los mejores profesionales en diferentes especialidades médicas para brindarte una 
              atención integral y de primera calidad.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Contamos con instalaciones modernas, equipamiento de última generación y un equipo 
              humano comprometido con tu recuperación y bienestar. Cada día trabajamos para superar 
              tus expectativas y ser tu clínica de confianza.
            </p>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-700 mb-2">10+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-sm text-gray-600">Pacientes atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-slate-50 hover:to-cyan-50 transition-all duration-300 group cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-700 to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <feature.icon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
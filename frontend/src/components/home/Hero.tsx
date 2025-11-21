// components/home/Hero.tsx
'use client';

export default function Hero() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('servicios');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-800 text-white overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Clínica <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">Wenka</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-cyan-100 max-w-3xl mx-auto">
          Tu salud y bienestar son nuestra prioridad. Ofrecemos atención médica especializada con profesionales altamente calificados.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToServices}
            className="px-8 py-4 bg-white text-slate-800 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Conoce nuestros servicios
          </button>
          
          <a
            href="#contacto"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-800 transition-all duration-300 hover:scale-105"
          >
            Contáctanos
          </a>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">6</p>
            <p className="text-cyan-200">Especialidades</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">10+</p>
            <p className="text-cyan-200">Años de experiencia</p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <p className="text-4xl md:text-5xl font-bold mb-2">100%</p>
            <p className="text-cyan-200">Atención personalizada</p>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
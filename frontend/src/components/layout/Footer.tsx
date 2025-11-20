// components/layout/Footer.tsx
'use client';

import { Heart, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  ];

  const footerLinks = {
    servicios: [
      { label: 'Fisioterapia', href: '#servicios' },
      { label: 'Medicina General', href: '#servicios' },
      { label: 'Cirugía', href: '#servicios' },
      { label: 'Entrenamiento Funcional', href: '#servicios' },
      { label: 'Odontología', href: '#servicios' },
      { label: 'Podología', href: '#servicios' },
    ],
    enlaces: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Servicios', href: '#servicios' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Contacto', href: '#contacto' },
    ],
    legal: [
      { label: 'Términos y Condiciones', href: '#' },
      { label: 'Política de Privacidad', href: '#' },
      { label: 'Aviso de Privacidad', href: '#' },
    ],
  };

  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decoración superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Información de la clínica */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold">Clínica Wenka</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Tu salud y bienestar son nuestra prioridad. Ofrecemos atención médica especializada con profesionales comprometidos.
            </p>
            
            {/* Redes sociales */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-700 ${social.color} hover:scale-110 hover:-translate-y-1`}
                  aria-label="Social media link"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Enlaces rápidos</h4>
            <ul className="space-y-2">
              {footerLinks.enlaces.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Legal y contacto */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-linear-to-br from-blue-900/50 to-purple-900/50 p-4 rounded-lg border border-gray-800">
              <h5 className="text-sm font-semibold mb-2">Newsletter</h5>
              <p className="text-xs text-gray-400 mb-3">Recibe noticias y promociones</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg border border-gray-700 focus:outline-none focus:border-blue-600"
                />
                <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  <svg
                    className="w-4 h-4"
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
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {currentYear} Clínica Wenka. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Diseñado con{' '}
              <Heart className="w-4 h-4 inline text-red-500 animate-pulse" fill="currentColor" />{' '}
              por Diego D'Maurice Hernández Jaramillo
            </p>
          </div>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
    </footer>
  );
}
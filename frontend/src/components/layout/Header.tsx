// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-blue-700' : 'text-white'
                }`}
              >
                Clínica Wenka
              </h2>
            </div>

            {/* Navegación y Botones Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Navigation isScrolled={isScrolled} />
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Mi Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'text-blue-700 hover:bg-blue-50'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg'
                        : 'bg-white text-blue-700 hover:shadow-xl'
                    }`}
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-blue-700' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>

          {/* Navegación Móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
              <Navigation
                isScrolled={true}
                isMobile={true}
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Botones de autenticación móvil */}
              <div className="px-4 pt-4 border-t border-gray-100 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        handleDashboardClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium"
                    >
                      Mi Panel
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => {
                        handleRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
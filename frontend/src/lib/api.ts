// frontend/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  // Appointments endpoints
  appointments: {
    list: `${API_BASE_URL}/api/appointments`,
    create: `${API_BASE_URL}/api/appointments`,
    getById: (id: number) => `${API_BASE_URL}/api/appointments/${id}`,
    update: (id: number) => `${API_BASE_URL}/api/appointments/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/appointments/${id}`,
  },
  // Health check
  health: `${API_BASE_URL}/health`,
};

// Helper function para hacer requests con autenticación
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('clinica_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si el token es inválido, limpiar y redirigir
  if (response.status === 401) {
    localStorage.removeItem('clinica_token');
    window.location.href = '/';
  }

  return response;
};

// Helper para manejar errores de la API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};
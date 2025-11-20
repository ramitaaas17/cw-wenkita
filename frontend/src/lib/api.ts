// lib/api.ts

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
    confirm: (id: number) => `${API_BASE_URL}/api/appointments/${id}/confirm`,
    cancel: (id: number) => `${API_BASE_URL}/api/appointments/${id}`,
  },
  // Health check
  health: `${API_BASE_URL}/health`,
};

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
    mode: 'cors',
    credentials: 'include',
  });

  // If unauthorized, clear token and redirect
  if (response.status === 401) {
    localStorage.removeItem('clinica_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  return response;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};

export const parseApiResponse = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};
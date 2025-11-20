// types/index.ts

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  created_at?: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface Appointment {
  id?: number;
  usuario_id?: number;
  nombre_paciente: string;
  telefono: string;
  email: string;
  servicio: string;
  fecha_cita: string;
  hora_cita: string;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  mensaje?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}
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

export interface CreateAppointmentRequest {
  nombre_paciente: string;
  telefono: string;
  email: string;
  servicio: string;
  fecha_cita: string;
  hora_cita: string;
  mensaje?: string;
}

export interface Appointment {
  id: number;
  nombre_paciente: string;
  telefono: string;
  email: string;
  servicio: string;
  fecha_cita: string;
  hora_cita: string;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'completada' | 'en_curso' | 'no_asistio';
  mensaje?: string;
  created_at?: string;
}

export interface AppointmentDetails {
  id: number;
  nombre_paciente: string;
  email_paciente: string;
  telefono_paciente: string;
  nombre_especialista: string;
  email_especialista: string;
  especialidad: string;
  tratamiento: string;
  fecha_hora: string;
  motivo: string;
  estado: string;
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

export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
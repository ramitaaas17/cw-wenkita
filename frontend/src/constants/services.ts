// constants/services.ts
import type { Service } from '@/src/types';

export const services: Service[] = [
  {
    id: 'fisioterapia',
    name: 'Fisioterapia',
    description: 'Tratamientos especializados para la recuperación de lesiones, rehabilitación deportiva y mejora de la movilidad.',
    icon: 'activity',
  },
  {
    id: 'medicina-general',
    name: 'Medicina General',
    description: 'Consultas médicas integrales para el diagnóstico, tratamiento y prevención de enfermedades.',
    icon: 'stethoscope',
  },
  {
    id: 'cirugia',
    name: 'Cirugía',
    description: 'Procedimientos quirúrgicos realizados por cirujanos especializados con equipamiento de última generación.',
    icon: 'scissors',
  },
  {
    id: 'entrenamiento-funcional',
    name: 'Entrenamiento Funcional',
    description: 'Programas personalizados de ejercicio físico para mejorar tu condición y alcanzar tus metas.',
    icon: 'dumbbell',
  },
  {
    id: 'odontologia',
    name: 'Odontología',
    description: 'Cuidado dental completo incluyendo limpieza, tratamientos estéticos y procedimientos especializados.',
    icon: 'smile',
  },
  {
    id: 'podologia',
    name: 'Podología',
    description: 'Diagnóstico y tratamiento de afecciones del pie, uñas encarnadas, callos y cuidado integral podológico.',
    icon: 'footprints',
  },
];
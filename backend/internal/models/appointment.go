package models

import "time"

// Appointment representa una cita médica en el sistema
type Appointment struct {
	ID             int       `json:"id"`
	UsuarioID      int       `json:"usuario_id"`
	PacienteID     int       `json:"paciente_id"`
	EspecialistaID int       `json:"especialista_id"`
	TratamientoID  int       `json:"tratamiento_id"`
	FechaHora      time.Time `json:"fecha_hora"`
	Motivo         string    `json:"motivo"`
	Estado         string    `json:"estado"` // programada, confirmada, cancelada, completada
	Notas          string    `json:"notas"`
	CreatedAt      time.Time `json:"created_at"`
}

// CreateAppointmentRequest estructura para crear una cita
type CreateAppointmentRequest struct {
	NombrePaciente string `json:"nombre_paciente"`
	Telefono       string `json:"telefono"`
	Email          string `json:"email"`
	Servicio       string `json:"servicio"`
	FechaCita      string `json:"fecha_cita"` // YYYY-MM-DD
	HoraCita       string `json:"hora_cita"`  // HH:MM
	Mensaje        string `json:"mensaje"`
}

// AppointmentResponse respuesta con información completa de la cita
type AppointmentResponse struct {
	ID             int       `json:"id"`
	NombrePaciente string    `json:"nombre_paciente"`
	Telefono       string    `json:"telefono"`
	Email          string    `json:"email"`
	Servicio       string    `json:"servicio"`
	FechaCita      string    `json:"fecha_cita"`
	HoraCita       string    `json:"hora_cita"`
	Estado         string    `json:"estado"`
	Mensaje        string    `json:"mensaje"`
	CreatedAt      time.Time `json:"created_at"`
}

// AppointmentWithDetails cita con información de especialista y tratamiento
type AppointmentWithDetails struct {
	ID                 int       `json:"id"`
	NombrePaciente     string    `json:"nombre_paciente"`
	EmailPaciente      string    `json:"email_paciente"`
	TelefonoPaciente   string    `json:"telefono_paciente"`
	NombreEspecialista string    `json:"nombre_especialista"`
	EmailEspecialista  string    `json:"email_especialista"`
	Especialidad       string    `json:"especialidad"`
	Tratamiento        string    `json:"tratamiento"`
	FechaHora          time.Time `json:"fecha_hora"`
	Motivo             string    `json:"motivo"`
	Estado             string    `json:"estado"`
	CreatedAt          time.Time `json:"created_at"`
}

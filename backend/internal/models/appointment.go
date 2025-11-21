// backend/internal/models/appointment.go
package models

import "time"

// Appointment representa una cita médica en el sistema
type Appointment struct {
	ID              int       `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	PacienteID      int       `json:"paciente_id" gorm:"column:paciente_id;not null"`
	EspecialistaID  int       `json:"especialista_id" gorm:"column:especialista_id;not null"`
	TratamientoID   int       `json:"tratamiento_id" gorm:"column:tratamiento_id;not null"`
	FechaHora       time.Time `json:"fecha_hora" gorm:"column:fecha_hora;not null"`
	DuracionMinutos int       `json:"duracion_minutos" gorm:"column:duracion_minutos;default:30"`
	Motivo          string    `json:"motivo" gorm:"column:motivo;type:text"`
	Estado          string    `json:"estado" gorm:"column:estado;type:varchar(20);default:'programada'"`
	Notas           string    `json:"notas" gorm:"column:notas;type:text"`
	CreatedAt       time.Time `json:"created_at" gorm:"column:fecha_creacion;autoCreateTime"`
}

// TableName especifica el nombre de la tabla
func (Appointment) TableName() string {
	return "citas"
}

// Paciente modelo para la tabla pacientes
type Paciente struct {
	ID              int       `gorm:"column:id;primaryKey;autoIncrement"`
	Nombre          string    `gorm:"column:nombre;type:varchar(100);not null"`
	ApellidoPaterno string    `gorm:"column:apellido_paterno;type:varchar(100);not null"`
	ApellidoMaterno string    `gorm:"column:apellido_materno;type:varchar(100)"`
	Email           string    `gorm:"column:email;type:varchar(255);uniqueIndex;not null"`
	Telefono        string    `gorm:"column:telefono;type:varchar(20)"`
	FechaNacimiento time.Time `gorm:"column:fecha_nacimiento"`
	Sexo            string    `gorm:"column:sexo;type:char(1)"`
	FechaRegistro   time.Time `gorm:"column:fecha_registro;autoCreateTime"`
}

func (Paciente) TableName() string {
	return "pacientes"
}

// Especialista modelo para la tabla especialistas
type Especialista struct {
	ID              int    `gorm:"column:id;primaryKey;autoIncrement"`
	Nombre          string `gorm:"column:nombre;type:varchar(100);not null"`
	ApellidoPaterno string `gorm:"column:apellido_paterno;type:varchar(100);not null"`
	Email           string `gorm:"column:email;type:varchar(255);uniqueIndex;not null"`
	EspecialidadID  int    `gorm:"column:especialidad_id;not null"`
	Activo          bool   `gorm:"column:activo;default:true"`
}

func (Especialista) TableName() string {
	return "especialistas"
}

// Tratamiento modelo para la tabla tratamientos
type Tratamiento struct {
	ID                      int    `gorm:"column:id;primaryKey;autoIncrement"`
	Nombre                  string `gorm:"column:nombre;type:varchar(200);not null"`
	EspecialidadID          int    `gorm:"column:especialidad_id;not null"`
	DuracionEstimadaMinutos int    `gorm:"column:duracion_estimada_minutos;default:30"`
	Activo                  bool   `gorm:"column:activo;default:true"`
}

func (Tratamiento) TableName() string {
	return "tratamientos"
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

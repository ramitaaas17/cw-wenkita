package models

import (
	"time"
)

// Especialidad medica
type Especialidad struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Nombre        string    `gorm:"size:100;unique;not null" json:"nombre"`
	Descripcion   string    `gorm:"type:text" json:"descripcion"`
	Activo        bool      `gorm:"default:true" json:"activo"`
	FechaCreacion time.Time `gorm:"autoCreateTime" json:"fecha_creacion"`
}

// TableName: especialidades
func (Especialidad) TableName() string { return "especialidades" }

// Especialista (Doctor)
type Especialista struct {
	ID               uint         `gorm:"primaryKey" json:"id"`
	Nombre           string       `gorm:"size:100;not null" json:"nombre"`
	ApellidoPaterno  string       `gorm:"size:100;not null" json:"apellido_paterno"`
	ApellidoMaterno  string       `gorm:"size:100" json:"apellido_materno"`
	
	// Relacion: Un especialista tiene una especialidad
	EspecialidadID   uint         `gorm:"not null" json:"especialidad_id"`
	Especialidad     Especialidad `gorm:"foreignKey:EspecialidadID" json:"especialidad,omitempty"`

	CedulaProfesional string      `gorm:"size:50;unique;not null" json:"cedula_profesional"`
	Telefono          string      `gorm:"size:20" json:"telefono"`
	Email             string      `gorm:"size:100;unique" json:"email"`
	Activo            bool        `gorm:"default:true" json:"activo"`
	FechaContratacion time.Time   `gorm:"type:date;default:(CURRENT_DATE)" json:"fecha_contratacion"`
	FechaCreacion     time.Time   `gorm:"autoCreateTime" json:"fecha_creacion"`
}

func (Especialista) TableName() string { return "especialistas" }

// Paciente
type Paciente struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	Nombre            string    `gorm:"size:100;not null" json:"nombre"`
	ApellidoPaterno   string    `gorm:"size:100;not null" json:"apellido_paterno"`
	ApellidoMaterno   string    `gorm:"size:100" json:"apellido_materno"`
	FechaNacimiento   time.Time `gorm:"type:date;not null" json:"fecha_nacimiento"`
	Sexo              string    `gorm:"type:char(1);check:sexo IN ('M','F','O')" json:"sexo"` // M=Masculino, F=Femenino, O=Otro
	Telefono          string    `gorm:"size:20" json:"telefono"`
	Email             string    `gorm:"size:100" json:"email"`
	Direccion         string    `gorm:"type:text" json:"direccion"`
	Ciudad            string    `gorm:"size:100" json:"ciudad"`
	CodigoPostal      string    `gorm:"size:10" json:"codigo_postal"`
	TipoSangre        string    `gorm:"size:5" json:"tipo_sangre"`
	Alergias          string    `gorm:"type:text" json:"alergias"`
	EnfermedadesCron  string    `gorm:"type:text" json:"enfermedades_cronicas"`
	ContactoEmergNombre string  `gorm:"size:150" json:"contacto_emergencia_nombre"`
	ContactoEmergTel    string  `gorm:"size:20" json:"contacto_emergencia_telefono"`
	Activo            bool      `gorm:"default:true" json:"activo"`
	FechaRegistro     time.Time `gorm:"autoCreateTime" json:"fecha_registro"`
}

func (Paciente) TableName() string { return "pacientes" }

// Tratamiento disponible en el catalogo
type Tratamiento struct {
	ID               uint         `gorm:"primaryKey" json:"id"`
	EspecialidadID   uint         `json:"especialidad_id"`
	Especialidad     Especialidad `gorm:"foreignKey:EspecialidadID" json:"especialidad,omitempty"`
	Nombre           string       `gorm:"size:200;not null" json:"nombre"`
	Descripcion      string       `gorm:"type:text" json:"descripcion"`
	Costo            float64      `gorm:"type:decimal(10,2);not null" json:"costo"`
	DuracionMinutos  int          `json:"duracion_estimada_minutos"`
	Activo           bool         `gorm:"default:true" json:"activo"`
	FechaCreacion    time.Time    `gorm:"autoCreateTime" json:"fecha_creacion"`
}

func (Tratamiento) TableName() string { return "tratamientos" }

// Cita medica
type Cita struct {
	ID              uint         `gorm:"primaryKey" json:"id"`
	PacienteID      uint         `gorm:"not null" json:"paciente_id"`
	Paciente        Paciente     `gorm:"foreignKey:PacienteID" json:"paciente,omitempty"`
	EspecialistaID  uint         `gorm:"not null" json:"especialista_id"`
	Especialista    Especialista `gorm:"foreignKey:EspecialistaID" json:"especialista,omitempty"`
	TratamientoID   *uint        `json:"tratamiento_id"` // Puntero porque puede ser null
	Tratamiento     *Tratamiento `gorm:"foreignKey:TratamientoID" json:"tratamiento,omitempty"`
	
	FechaHora       time.Time    `gorm:"not null" json:"fecha_hora"`
	DuracionMinutos int          `gorm:"default:30" json:"duracion_minutos"`
	Motivo          string       `gorm:"type:text" json:"motivo"`
	Estado          string       `gorm:"size:20;default:'programada';check:estado IN ('programada', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_asistio')" json:"estado"`
	Notas           string       `gorm:"type:text" json:"notas"`
	FechaCreacion   time.Time    `gorm:"autoCreateTime" json:"fecha_creacion"`
}

func (Cita) TableName() string { return "citas" }

// Historial Clinico (Resultado de una cita)
type HistorialClinico struct {
	ID                  uint         `gorm:"primaryKey" json:"id"`
	CitaID              uint         `gorm:"unique;not null" json:"cita_id"`
	Cita                Cita         `gorm:"foreignKey:CitaID" json:"cita,omitempty"`
	PacienteID          uint         `gorm:"not null" json:"paciente_id"`
	Paciente            Paciente     `gorm:"foreignKey:PacienteID" json:"-"` // Oculto para no redundar, ya viene en Cita
	EspecialistaID      uint         `gorm:"not null" json:"especialista_id"`
	Especialista        Especialista `gorm:"foreignKey:EspecialistaID" json:"-"`
	
	FechaConsulta       time.Time    `gorm:"default:CURRENT_TIMESTAMP" json:"fecha_consulta"`
	MotivoConsulta      string       `gorm:"type:text;not null" json:"motivo_consulta"`
	Sintomas            string       `gorm:"type:text" json:"sintomas"`
	Diagnostico         string       `gorm:"type:text" json:"diagnostico"`
	TratamientoAplicado string       `gorm:"type:text" json:"tratamiento_aplicado"`
	Medicamentos        string       `gorm:"type:text" json:"medicamentos_recetados"`
	Indicaciones        string       `gorm:"type:text" json:"indicaciones"`
	Observaciones       string       `gorm:"type:text" json:"observaciones"`
	ProximaCita         *time.Time   `gorm:"type:date" json:"proxima_cita"`
	ArchivoAdjunto      string       `gorm:"size:255" json:"archivo_adjunto"`
	FechaCreacion       time.Time    `gorm:"autoCreateTime" json:"fecha_creacion"`
}

func (HistorialClinico) TableName() string { return "historial_clinico" }

// Pago
type Pago struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	CitaID      uint      `gorm:"not null" json:"cita_id"`
	Cita        Cita      `gorm:"foreignKey:CitaID" json:"cita,omitempty"`
	PacienteID  uint      `gorm:"not null" json:"paciente_id"`
	Monto       float64   `gorm:"type:decimal(10,2);not null" json:"monto"`
	MetodoPago  string    `gorm:"size:50;check:metodo_pago IN ('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'otro')" json:"metodo_pago"`
	Estado      string    `gorm:"size:20;default:'pendiente';check:estado IN ('pendiente', 'pagado', 'cancelado', 'reembolsado')" json:"estado"`
	FechaPago   time.Time `gorm:"autoCreateTime" json:"fecha_pago"`
	Referencia  string    `gorm:"size:100" json:"referencia"`
	Notas       string    `gorm:"type:text" json:"notas"`
}

func (Pago) TableName() string { return "pagos" }
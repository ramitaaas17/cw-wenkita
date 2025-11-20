package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/wenka/backend/internal/models"
)

type AppointmentRepository struct {
	db *sql.DB
}

// NewAppointmentRepository crea una nueva instancia del repositorio
func NewAppointmentRepository(db *sql.DB) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

// Create inserta una nueva cita en la base de datos
func (r *AppointmentRepository) Create(appointment *models.Appointment) error {
	query := `
		INSERT INTO citas (paciente_id, especialista_id, tratamiento_id, fecha_hora, motivo, estado, notas, fecha_creacion)
		VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
	`

	result, err := r.db.Exec(
		query,
		appointment.PacienteID,
		appointment.EspecialistaID,
		appointment.TratamientoID,
		appointment.FechaHora,
		appointment.Motivo,
		appointment.Estado,
		appointment.Notas,
	)
	if err != nil {
		return fmt.Errorf("error al crear cita: %v", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error al obtener ID: %v", err)
	}

	appointment.ID = int(id)
	return nil
}

// FindByID busca una cita por su ID con información completa
func (r *AppointmentRepository) FindByID(id int) (*models.AppointmentWithDetails, error) {
	query := `
		SELECT 
			c.id,
			CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_paciente,
			p.email as email_paciente,
			p.telefono as telefono_paciente,
			CONCAT(e.nombre, ' ', e.apellido_paterno) as nombre_especialista,
			e.email as email_especialista,
			es.nombre as especialidad,
			t.nombre as tratamiento,
			c.fecha_hora,
			c.motivo,
			c.estado,
			c.fecha_creacion
		FROM citas c
		JOIN pacientes p ON c.paciente_id = p.id
		JOIN especialistas e ON c.especialista_id = e.id
		JOIN especialidades es ON e.especialidad_id = es.id
		JOIN tratamientos t ON c.tratamiento_id = t.id
		WHERE c.id = ?
	`

	appointment := &models.AppointmentWithDetails{}
	err := r.db.QueryRow(query, id).Scan(
		&appointment.ID,
		&appointment.NombrePaciente,
		&appointment.EmailPaciente,
		&appointment.TelefonoPaciente,
		&appointment.NombreEspecialista,
		&appointment.EmailEspecialista,
		&appointment.Especialidad,
		&appointment.Tratamiento,
		&appointment.FechaHora,
		&appointment.Motivo,
		&appointment.Estado,
		&appointment.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, fmt.Errorf("error al buscar cita: %v", err)
	}

	return appointment, nil
}

// FindByUserID obtiene todas las citas de un usuario
func (r *AppointmentRepository) FindByUserID(userID int) ([]models.AppointmentResponse, error) {
	query := `
		SELECT 
			c.id,
			CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_paciente,
			p.telefono,
			p.email,
			t.nombre as servicio,
			DATE(c.fecha_hora) as fecha_cita,
			TIME(c.fecha_hora) as hora_cita,
			c.estado,
			c.motivo as mensaje,
			c.fecha_creacion
		FROM citas c
		JOIN pacientes p ON c.paciente_id = p.id
		JOIN tratamientos t ON c.tratamiento_id = t.id
		WHERE p.id IN (SELECT id FROM pacientes WHERE email = (SELECT email FROM usuarios WHERE id = ?))
		ORDER BY c.fecha_hora DESC
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error al obtener citas: %v", err)
	}
	defer rows.Close()

	var appointments []models.AppointmentResponse
	for rows.Next() {
		var apt models.AppointmentResponse
		var fechaCita, horaCita string

		err := rows.Scan(
			&apt.ID,
			&apt.NombrePaciente,
			&apt.Telefono,
			&apt.Email,
			&apt.Servicio,
			&fechaCita,
			&horaCita,
			&apt.Estado,
			&apt.Mensaje,
			&apt.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error al escanear cita: %v", err)
		}

		apt.FechaCita = fechaCita
		apt.HoraCita = horaCita[:5] // Solo HH:MM
		appointments = append(appointments, apt)
	}

	return appointments, nil
}

// CheckAvailability verifica si un especialista está disponible en un horario específico
func (r *AppointmentRepository) CheckAvailability(especialistaID int, fechaHora time.Time, duracionMinutos int) (bool, error) {
	// Calcula el rango de tiempo de la cita
	startTime := fechaHora
	endTime := fechaHora.Add(time.Duration(duracionMinutos) * time.Minute)

	// Busca citas existentes que se traslapen con el horario solicitado
	query := `
		SELECT COUNT(*) 
		FROM citas 
		WHERE especialista_id = ? 
		AND estado NOT IN ('cancelada', 'completada')
		AND (
			(fecha_hora < ? AND DATE_ADD(fecha_hora, INTERVAL duracion_minutos MINUTE) > ?)
			OR (fecha_hora >= ? AND fecha_hora < ?)
		)
	`

	var count int
	err := r.db.QueryRow(query, especialistaID, endTime, startTime, startTime, endTime).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("error al verificar disponibilidad: %v", err)
	}

	// Si count es 0, el horario está disponible
	return count == 0, nil
}

// UpdateStatus actualiza el estado de una cita
func (r *AppointmentRepository) UpdateStatus(id int, newStatus string) error {
	query := `UPDATE citas SET estado = ? WHERE id = ?`

	result, err := r.db.Exec(query, newStatus, id)
	if err != nil {
		return fmt.Errorf("error al actualizar estado: %v", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar actualización: %v", err)
	}

	if rows == 0 {
		return fmt.Errorf("cita no encontrada")
	}

	return nil
}

// Delete elimina (cancela) una cita
func (r *AppointmentRepository) Delete(id int) error {
	// En lugar de eliminar, cambiamos el estado a cancelada
	return r.UpdateStatus(id, "cancelada")
}

// FindEspecialistaByServicio encuentra un especialista disponible para un servicio
func (r *AppointmentRepository) FindEspecialistaByServicio(servicio string) (*struct {
	ID              int
	Nombre          string
	Email           string
	EspecialidadID  int
	TratamientoID   int
	DuracionMinutos int
}, error) {
	query := `
		SELECT 
			e.id,
			CONCAT(e.nombre, ' ', e.apellido_paterno) as nombre,
			e.email,
			t.especialidad_id,
			t.id as tratamiento_id,
			t.duracion_estimada_minutos
		FROM especialistas e
		JOIN tratamientos t ON t.especialidad_id = e.especialidad_id
		WHERE t.nombre = ? AND e.activo = TRUE AND t.activo = TRUE
		LIMIT 1
	`

	result := &struct {
		ID              int
		Nombre          string
		Email           string
		EspecialidadID  int
		TratamientoID   int
		DuracionMinutos int
	}{}

	err := r.db.QueryRow(query, servicio).Scan(
		&result.ID,
		&result.Nombre,
		&result.Email,
		&result.EspecialidadID,
		&result.TratamientoID,
		&result.DuracionMinutos,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no se encontró especialista para el servicio: %s", servicio)
	}

	if err != nil {
		return nil, fmt.Errorf("error al buscar especialista: %v", err)
	}

	return result, nil
}

// CreateOrGetPaciente crea un paciente si no existe o lo obtiene si ya existe
func (r *AppointmentRepository) CreateOrGetPaciente(nombre, apellido, email, telefono string) (int, error) {
	// Primero intenta buscar el paciente por email
	var pacienteID int
	queryFind := `SELECT id FROM pacientes WHERE email = ?`
	err := r.db.QueryRow(queryFind, email).Scan(&pacienteID)

	if err == nil {
		// El paciente ya existe
		return pacienteID, nil
	}

	if err != sql.ErrNoRows {
		return 0, fmt.Errorf("error al buscar paciente: %v", err)
	}

	// El paciente no existe, lo creamos
	queryInsert := `
		INSERT INTO pacientes (nombre, apellido_paterno, email, telefono, fecha_nacimiento, sexo, fecha_registro)
		VALUES (?, ?, ?, ?, '2000-01-01', 'O', NOW())
	`

	result, err := r.db.Exec(queryInsert, nombre, apellido, email, telefono)
	if err != nil {
		return 0, fmt.Errorf("error al crear paciente: %v", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("error al obtener ID de paciente: %v", err)
	}

	return int(id), nil
}

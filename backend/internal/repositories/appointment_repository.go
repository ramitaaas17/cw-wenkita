// backend/internal/repositories/appointment_repository.go
package repositories

import (
	"fmt"
	"time"

	"github.com/wenka/backend/internal/models"
	"gorm.io/gorm"
)

type AppointmentRepository struct {
	db *gorm.DB
}

// NewAppointmentRepository crea una nueva instancia del repositorio
func NewAppointmentRepository(db *gorm.DB) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

// Create inserta una nueva cita en la base de datos
func (r *AppointmentRepository) Create(appointment *models.Appointment) error {
	// Obtener duración del tratamiento si no está definida
	if appointment.DuracionMinutos == 0 {
		var tratamiento models.Tratamiento
		if err := r.db.First(&tratamiento, appointment.TratamientoID).Error; err == nil {
			appointment.DuracionMinutos = tratamiento.DuracionEstimadaMinutos
		} else {
			appointment.DuracionMinutos = 30 // valor por defecto
		}
	}

	result := r.db.Create(appointment)
	if result.Error != nil {
		return fmt.Errorf("error al crear cita: %v", result.Error)
	}

	return nil
}

// FindByID busca una cita por su ID con información completa
func (r *AppointmentRepository) FindByID(id int) (*models.AppointmentWithDetails, error) {
	var result models.AppointmentWithDetails

	err := r.db.Raw(`
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
			COALESCE(c.motivo, '') as motivo,
			c.estado,
			c.fecha_creacion as created_at
		FROM citas c
		JOIN pacientes p ON c.paciente_id = p.id
		JOIN especialistas e ON c.especialista_id = e.id
		JOIN especialidades es ON e.especialidad_id = es.id
		JOIN tratamientos t ON c.tratamiento_id = t.id
		WHERE c.id = ?
	`, id).Scan(&result).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("cita no encontrada")
		}
		return nil, fmt.Errorf("error al buscar cita: %v", err)
	}

	// Verificar si se encontró un resultado
	if result.ID == 0 {
		return nil, fmt.Errorf("cita no encontrada")
	}

	return &result, nil
}

// FindByUserID obtiene todas las citas de un usuario
func (r *AppointmentRepository) FindByUserID(userID int) ([]models.AppointmentResponse, error) {
	// Primero obtenemos el email del usuario
	var user models.User
	if err := r.db.First(&user, userID).Error; err != nil {
		return nil, fmt.Errorf("error al obtener usuario: %v", err)
	}

	var appointments []models.AppointmentResponse

	err := r.db.Raw(`
		SELECT 
			c.id,
			CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_paciente,
			p.telefono,
			p.email,
			t.nombre as servicio,
			DATE(c.fecha_hora) as fecha_cita,
			TIME_FORMAT(c.fecha_hora, '%H:%i') as hora_cita,
			c.estado,
			COALESCE(c.motivo, '') as mensaje,
			c.fecha_creacion as created_at
		FROM citas c
		JOIN pacientes p ON c.paciente_id = p.id
		JOIN tratamientos t ON c.tratamiento_id = t.id
		WHERE p.email = ?
		ORDER BY c.fecha_hora DESC
	`, user.Email).Scan(&appointments).Error

	if err != nil {
		return nil, fmt.Errorf("error al obtener citas: %v", err)
	}

	// Si no hay citas, retornar array vacío en lugar de nil
	if appointments == nil {
		return []models.AppointmentResponse{}, nil
	}

	return appointments, nil
}

// CheckAvailability verifica si un especialista está disponible
func (r *AppointmentRepository) CheckAvailability(especialistaID int, fechaHora time.Time, duracionMinutos int) (bool, error) {
	// Calcula el rango de tiempo de la cita
	startTime := fechaHora
	endTime := fechaHora.Add(time.Duration(duracionMinutos) * time.Minute)

	// Usar una query más simple y efectiva
	var count int64
	err := r.db.Model(&models.Appointment{}).
		Where("especialista_id = ?", especialistaID).
		Where("estado NOT IN ?", []string{"cancelada", "completada"}).
		Where(r.db.Where("fecha_hora < ? AND DATE_ADD(fecha_hora, INTERVAL duracion_minutos MINUTE) > ?", endTime, startTime).
			Or("fecha_hora >= ? AND fecha_hora < ?", startTime, endTime)).
		Count(&count).Error

	if err != nil {
		return false, fmt.Errorf("error al verificar disponibilidad: %v", err)
	}

	// Si count es 0, el horario está disponible
	return count == 0, nil
}

// UpdateStatus actualiza el estado de una cita
func (r *AppointmentRepository) UpdateStatus(id int, newStatus string) error {
	result := r.db.Model(&models.Appointment{}).
		Where("id = ?", id).
		Update("estado", newStatus)

	if result.Error != nil {
		return fmt.Errorf("error al actualizar estado: %v", result.Error)
	}

	if result.RowsAffected == 0 {
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
// MODIFICADO: Ahora busca por especialidad en lugar de tratamiento exacto
func (r *AppointmentRepository) FindEspecialistaByServicio(servicio string) (*struct {
	ID              int
	Nombre          string
	Email           string
	EspecialidadID  int
	TratamientoID   int
	DuracionMinutos int
}, error) {
	result := &struct {
		ID              int
		Nombre          string
		Email           string
		EspecialidadID  int
		TratamientoID   int
		DuracionMinutos int
	}{}

	// Primero intentamos buscar por nombre exacto del tratamiento
	err := r.db.Raw(`
		SELECT 
			e.id,
			CONCAT(e.nombre, ' ', e.apellido_paterno) as nombre,
			e.email,
			t.especialidad_id,
			t.id as tratamiento_id,
			t.duracion_estimada_minutos as duracion_minutos
		FROM especialistas e
		JOIN tratamientos t ON t.especialidad_id = e.especialidad_id
		WHERE t.nombre = ? AND e.activo = TRUE AND t.activo = TRUE
		LIMIT 1
	`, servicio).Scan(result).Error

	// Si no se encuentra por nombre de tratamiento, buscar por nombre de especialidad
	if err != nil || result.ID == 0 {
		err = r.db.Raw(`
			SELECT 
				e.id,
				CONCAT(e.nombre, ' ', e.apellido_paterno) as nombre,
				e.email,
				es.id as especialidad_id,
				t.id as tratamiento_id,
				t.duracion_estimada_minutos as duracion_minutos
			FROM especialistas e
			JOIN especialidades es ON es.id = e.especialidad_id
			JOIN tratamientos t ON t.especialidad_id = es.id
			WHERE es.nombre = ? AND e.activo = TRUE AND t.activo = TRUE
			LIMIT 1
		`, servicio).Scan(result).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, fmt.Errorf("no se encontró especialista para el servicio: %s", servicio)
			}
			return nil, fmt.Errorf("error al buscar especialista: %v", err)
		}
	}

	// Verificar si se encontró un resultado
	if result.ID == 0 {
		return nil, fmt.Errorf("no se encontró especialista para el servicio: %s", servicio)
	}

	return result, nil
}

// CreateOrGetPaciente crea un paciente si no existe o lo obtiene si ya existe
func (r *AppointmentRepository) CreateOrGetPaciente(nombre, apellido, email, telefono string) (int, error) {
	// Primero intenta buscar el paciente por email
	var paciente models.Paciente
	err := r.db.Where("email = ?", email).First(&paciente).Error

	if err == nil {
		// El paciente ya existe, actualizamos su información
		r.db.Model(&paciente).Updates(map[string]interface{}{
			"nombre":           nombre,
			"apellido_paterno": apellido,
			"telefono":         telefono,
		})
		return paciente.ID, nil
	}

	if err != gorm.ErrRecordNotFound {
		return 0, fmt.Errorf("error al buscar paciente: %v", err)
	}

	// El paciente no existe, lo creamos
	newPaciente := models.Paciente{
		Nombre:          nombre,
		ApellidoPaterno: apellido,
		Email:           email,
		Telefono:        telefono,
		FechaNacimiento: time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
		Sexo:            "O",
	}

	result := r.db.Create(&newPaciente)
	if result.Error != nil {
		return 0, fmt.Errorf("error al crear paciente: %v", result.Error)
	}

	return newPaciente.ID, nil
}

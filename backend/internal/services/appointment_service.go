// backend/internal/services/appointment_service.go
package services

import (
	"fmt"
	"strings"
	"time"

	"github.com/wenka/backend/internal/models"
	"github.com/wenka/backend/internal/repositories"
)

type AppointmentService struct {
	appointmentRepo *repositories.AppointmentRepository
	emailService    *EmailService
}

// NewAppointmentService crea una nueva instancia del servicio
func NewAppointmentService(appointmentRepo *repositories.AppointmentRepository, emailService *EmailService) *AppointmentService {
	return &AppointmentService{
		appointmentRepo: appointmentRepo,
		emailService:    emailService,
	}
}

// CreateAppointment crea una nueva cita con validaciones
func (s *AppointmentService) CreateAppointment(userID int, req *models.CreateAppointmentRequest) (*models.AppointmentResponse, error) {
	// Validar datos de entrada
	if err := s.validateAppointmentRequest(req); err != nil {
		return nil, err
	}

	// Parsear nombre completo del paciente
	nombreParts := strings.Fields(req.NombrePaciente)
	if len(nombreParts) < 2 {
		return nil, fmt.Errorf("el nombre debe incluir nombre y apellido")
	}
	nombre := nombreParts[0]
	apellido := strings.Join(nombreParts[1:], " ")

	// Crear o obtener paciente
	pacienteID, err := s.appointmentRepo.CreateOrGetPaciente(nombre, apellido, req.Email, req.Telefono)
	if err != nil {
		return nil, fmt.Errorf("error al procesar paciente: %v", err)
	}

	// Buscar especialista y tratamiento disponible para el servicio
	especialistaInfo, err := s.appointmentRepo.FindEspecialistaByServicio(req.Servicio)
	if err != nil {
		return nil, err
	}

	// Combinar fecha y hora
	fechaHora, err := time.Parse("2006-01-02 15:04", req.FechaCita+" "+req.HoraCita)
	if err != nil {
		return nil, fmt.Errorf("formato de fecha u hora inválido: %v", err)
	}

	// Validar que la fecha no sea en el pasado
	if fechaHora.Before(time.Now()) {
		return nil, fmt.Errorf("no se puede agendar cita en el pasado")
	}

	// Verificar disponibilidad del especialista
	isAvailable, err := s.appointmentRepo.CheckAvailability(
		especialistaInfo.ID,
		fechaHora,
		especialistaInfo.DuracionMinutos,
	)
	if err != nil {
		return nil, fmt.Errorf("error al verificar disponibilidad: %v", err)
	}

	if !isAvailable {
		return nil, fmt.Errorf("el horario seleccionado no está disponible. Por favor elige otro horario")
	}

	// Crear la cita
	appointment := &models.Appointment{
		PacienteID:     pacienteID,
		EspecialistaID: especialistaInfo.ID,
		TratamientoID:  especialistaInfo.TratamientoID,
		FechaHora:      fechaHora,
		Motivo:         req.Mensaje,
		Estado:         "programada",
		Notas:          "",
	}

	err = s.appointmentRepo.Create(appointment)
	if err != nil {
		return nil, fmt.Errorf("error al crear cita: %v", err)
	}

	// Obtener la cita completa con detalles
	appointmentDetails, err := s.appointmentRepo.FindByID(appointment.ID)
	if err != nil {
		return nil, fmt.Errorf("error al obtener detalles de la cita: %v", err)
	}

	// Enviar emails de confirmación de forma asíncrona
	go func() {
		// Email al paciente
		if err := s.emailService.SendAppointmentConfirmationToPatient(appointmentDetails); err != nil {
			fmt.Printf("Error al enviar email al paciente: %v\n", err)
		}

		// Email al especialista
		if err := s.emailService.SendAppointmentNotificationToSpecialist(appointmentDetails); err != nil {
			fmt.Printf("Error al enviar email al especialista: %v\n", err)
		}
	}()

	// Construir respuesta
	response := &models.AppointmentResponse{
		ID:             appointment.ID,
		NombrePaciente: req.NombrePaciente,
		Telefono:       req.Telefono,
		Email:          req.Email,
		Servicio:       req.Servicio,
		FechaCita:      req.FechaCita,
		HoraCita:       req.HoraCita,
		Estado:         "programada",
		Mensaje:        req.Mensaje,
		CreatedAt:      time.Now(),
	}

	return response, nil
}

// GetUserAppointments obtiene todas las citas de un usuario
func (s *AppointmentService) GetUserAppointments(userID int) ([]models.AppointmentResponse, error) {
	appointments, err := s.appointmentRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	if appointments == nil {
		return []models.AppointmentResponse{}, nil
	}

	return appointments, nil
}

// GetAppointmentByID obtiene una cita específica
func (s *AppointmentService) GetAppointmentByID(id int) (*models.AppointmentWithDetails, error) {
	appointment, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if appointment == nil {
		return nil, fmt.Errorf("cita no encontrada")
	}

	return appointment, nil
}

// ConfirmAppointment confirma una cita (usado por especialistas)
func (s *AppointmentService) ConfirmAppointment(id int) error {
	return s.appointmentRepo.UpdateStatus(id, "confirmada")
}

// CancelAppointment cancela una cita
func (s *AppointmentService) CancelAppointment(id int) error {
	return s.appointmentRepo.Delete(id)
}

// validateAppointmentRequest valida los datos de la solicitud
func (s *AppointmentService) validateAppointmentRequest(req *models.CreateAppointmentRequest) error {
	if req.NombrePaciente == "" {
		return fmt.Errorf("el nombre del paciente es requerido")
	}

	if req.Email == "" {
		return fmt.Errorf("el email es requerido")
	}

	if req.Telefono == "" {
		return fmt.Errorf("el teléfono es requerido")
	}

	if req.Servicio == "" {
		return fmt.Errorf("el servicio es requerido")
	}

	if req.FechaCita == "" {
		return fmt.Errorf("la fecha de la cita es requerida")
	}

	if req.HoraCita == "" {
		return fmt.Errorf("la hora de la cita es requerida")
	}

	// Validar formato de fecha
	_, err := time.Parse("2006-01-02", req.FechaCita)
	if err != nil {
		return fmt.Errorf("formato de fecha inválido. Use YYYY-MM-DD")
	}

	// Validar formato de hora
	_, err = time.Parse("15:04", req.HoraCita)
	if err != nil {
		return fmt.Errorf("formato de hora inválido. Use HH:MM")
	}

	return nil
}

// backend/internal/handlers/appointment_handler.go
package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/wenka/backend/internal/models"
	"github.com/wenka/backend/internal/services"
	"github.com/wenka/backend/internal/utils"
)

type AppointmentHandler struct {
	appointmentService *services.AppointmentService
	jwtSecret          string
}

// NewAppointmentHandler crea una nueva instancia del handler
func NewAppointmentHandler(appointmentService *services.AppointmentService, jwtSecret string) *AppointmentHandler {
	return &AppointmentHandler{
		appointmentService: appointmentService,
		jwtSecret:          jwtSecret,
	}
}

// CreateAppointment maneja la creación de una nueva cita
func (h *AppointmentHandler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	// Obtener usuario autenticado del token
	userID, err := h.getUserIDFromToken(r)
	if err != nil {
		log.Printf("Error de autenticación: %v", err)
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	log.Printf("Usuario autenticado: %d", userID)

	// Parsear el request body
	var req models.CreateAppointmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error al decodificar request: %v", err)
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	log.Printf("Request recibido: %+v", req)

	// Crear la cita
	appointment, err := h.appointmentService.CreateAppointment(userID, &req)
	if err != nil {
		log.Printf("Error al crear cita: %v", err)

		// Errores de validación o disponibilidad
		if strings.Contains(err.Error(), "disponible") ||
			strings.Contains(err.Error(), "requerido") ||
			strings.Contains(err.Error(), "inválido") ||
			strings.Contains(err.Error(), "pasado") ||
			strings.Contains(err.Error(), "no se encontró especialista") {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		// Errores de servidor
		respondWithError(w, http.StatusInternalServerError, "Error al crear la cita")
		return
	}

	log.Printf("Cita creada exitosamente: %+v", appointment)
	respondWithJSON(w, http.StatusCreated, appointment)
}

// GetAppointments obtiene todas las citas del usuario autenticado
func (h *AppointmentHandler) GetAppointments(w http.ResponseWriter, r *http.Request) {
	// Obtener usuario autenticado
	userID, err := h.getUserIDFromToken(r)
	if err != nil {
		log.Printf("Error de autenticación en GetAppointments: %v", err)
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	log.Printf("Obteniendo citas para usuario: %d", userID)

	// Obtener citas
	appointments, err := h.appointmentService.GetUserAppointments(userID)
	if err != nil {
		log.Printf("Error al obtener citas: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Error al obtener citas")
		return
	}

	log.Printf("Citas encontradas: %d", len(appointments))
	respondWithJSON(w, http.StatusOK, appointments)
}

// GetAppointmentByID obtiene una cita específica por su ID
func (h *AppointmentHandler) GetAppointmentByID(w http.ResponseWriter, r *http.Request) {
	// Verificar autenticación
	_, err := h.getUserIDFromToken(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	// Obtener ID de la cita
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Obtener cita
	appointment, err := h.appointmentService.GetAppointmentByID(id)
	if err != nil {
		if strings.Contains(err.Error(), "no encontrada") {
			respondWithError(w, http.StatusNotFound, "Cita no encontrada")
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Error al obtener la cita")
		return
	}

	respondWithJSON(w, http.StatusOK, appointment)
}

// ConfirmAppointment confirma una cita (usado por especialistas)
func (h *AppointmentHandler) ConfirmAppointment(w http.ResponseWriter, r *http.Request) {
	// Obtener ID de la cita
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Confirmar cita
	err = h.appointmentService.ConfirmAppointment(id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al confirmar la cita")
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Cita confirmada exitosamente",
	})
}

// CancelAppointment cancela una cita
func (h *AppointmentHandler) CancelAppointment(w http.ResponseWriter, r *http.Request) {
	// Verificar autenticación
	_, err := h.getUserIDFromToken(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	// Obtener ID de la cita
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Cancelar cita
	err = h.appointmentService.CancelAppointment(id)
	if err != nil {
		log.Printf("Error al cancelar cita %d: %v", id, err)
		respondWithError(w, http.StatusInternalServerError, "Error al cancelar la cita")
		return
	}

	log.Printf("Cita %d cancelada exitosamente", id)
	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Cita cancelada exitosamente",
	})
}

// getUserIDFromToken extrae el ID del usuario del token JWT
func (h *AppointmentHandler) getUserIDFromToken(r *http.Request) (int, error) {
	// Obtener token del header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return 0, http.ErrNoCookie
	}

	// Extraer token (formato: "Bearer TOKEN")
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return 0, http.ErrNoCookie
	}

	// Validar token
	claims, err := utils.ValidateToken(tokenParts[1], h.jwtSecret)
	if err != nil {
		return 0, err
	}

	return claims.UserID, nil
}

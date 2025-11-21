// backend/internal/handlers/appointment_handler.go
package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

func NewAppointmentHandler(appointmentService *services.AppointmentService, jwtSecret string) *AppointmentHandler {
	return &AppointmentHandler{
		appointmentService: appointmentService,
		jwtSecret:          jwtSecret,
	}
}

func (h *AppointmentHandler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	userID, err := h.getUserIDFromToken(r)
	if err != nil {
		log.Printf("Error de autenticación: %v", err)
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	log.Printf("Usuario autenticado: %d", userID)

	var req models.CreateAppointmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error al decodificar request: %v", err)
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	log.Printf("Request recibido: %+v", req)

	appointment, err := h.appointmentService.CreateAppointment(userID, &req)
	if err != nil {
		log.Printf("Error al crear cita: %v", err)

		if strings.Contains(err.Error(), "disponible") ||
			strings.Contains(err.Error(), "requerido") ||
			strings.Contains(err.Error(), "inválido") ||
			strings.Contains(err.Error(), "pasado") ||
			strings.Contains(err.Error(), "no se encontró especialista") {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		respondWithError(w, http.StatusInternalServerError, "Error al crear la cita")
		return
	}

	log.Printf("Cita creada exitosamente: %+v", appointment)
	respondWithJSON(w, http.StatusCreated, appointment)
}

func (h *AppointmentHandler) GetAppointments(w http.ResponseWriter, r *http.Request) {
	userID, err := h.getUserIDFromToken(r)
	if err != nil {
		log.Printf("Error de autenticación en GetAppointments: %v", err)
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	log.Printf("Obteniendo citas para usuario: %d", userID)

	appointments, err := h.appointmentService.GetUserAppointments(userID)
	if err != nil {
		log.Printf("Error al obtener citas: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Error al obtener citas")
		return
	}

	log.Printf("Citas encontradas: %d", len(appointments))
	respondWithJSON(w, http.StatusOK, appointments)
}

func (h *AppointmentHandler) GetAppointmentByID(w http.ResponseWriter, r *http.Request) {
	// NO requiere autenticación para que el especialista pueda ver los detalles
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

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

// ConfirmAppointment confirma una cita (usado por especialistas desde email)
func (h *AppointmentHandler) ConfirmAppointment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	log.Printf("Confirmando cita ID: %d", id)

	// Confirmar cita
	err = h.appointmentService.ConfirmAppointment(id)
	if err != nil {
		log.Printf("Error al confirmar cita %d: %v", id, err)

		// Si es GET (desde email), redirigir con error
		if r.Method == http.MethodGet {
			frontendURL := getEnvOrDefault("FRONTEND_URL", "http://localhost:3000")
			// 👇 CAMBIO AQUÍ - Nueva ruta
			http.Redirect(w, r, fmt.Sprintf("%s/confirm-appointment/confirm/%d?error=true", frontendURL, id), http.StatusSeeOther)
			return
		}

		respondWithError(w, http.StatusInternalServerError, "Error al confirmar la cita")
		return
	}

	log.Printf("Cita %d confirmada exitosamente", id)

	// Si es una petición GET (desde el email), redirigir al frontend
	if r.Method == http.MethodGet {
		frontendURL := getEnvOrDefault("FRONTEND_URL", "http://localhost:3000")
		// 👇 CAMBIO AQUÍ - Nueva ruta
		http.Redirect(w, r, fmt.Sprintf("%s/confirm-appointment/confirm/%d", frontendURL, id), http.StatusSeeOther)
		return
	}

	// Si es POST/PUT (desde la API), retornar JSON
	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Cita confirmada exitosamente",
	})
}

func (h *AppointmentHandler) CancelAppointment(w http.ResponseWriter, r *http.Request) {
	_, err := h.getUserIDFromToken(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "No autorizado")
		return
	}

	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

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

func (h *AppointmentHandler) getUserIDFromToken(r *http.Request) (int, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return 0, fmt.Errorf("no authorization header")
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return 0, fmt.Errorf("invalid authorization format")
	}

	claims, err := utils.ValidateToken(tokenParts[1], h.jwtSecret)
	if err != nil {
		return 0, err
	}

	return claims.UserID, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

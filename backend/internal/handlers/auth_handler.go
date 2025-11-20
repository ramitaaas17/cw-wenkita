package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/wenka/backend/internal/models"
	"github.com/wenka/backend/internal/services"
	"github.com/wenka/backend/internal/utils"
)

type AuthHandler struct {
	authService *services.AuthService
	jwtSecret   string
}

// NewAuthHandler crea una nueva instancia del handler
func NewAuthHandler(authService *services.AuthService, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		jwtSecret:   jwtSecret,
	}
}

// Register maneja el registro de usuarios
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validaciones básicas
	if req.Nombre == "" || req.Apellido == "" || req.Email == "" || req.Password == "" {
		respondWithError(w, http.StatusBadRequest, "Todos los campos son requeridos")
		return
	}

	if len(req.Password) < 6 {
		respondWithError(w, http.StatusBadRequest, "La contraseña debe tener al menos 6 caracteres")
		return
	}

	// Registrar usuario
	authResponse, err := h.authService.Register(&req)
	if err != nil {
		if strings.Contains(err.Error(), "ya está registrado") {
			respondWithError(w, http.StatusConflict, err.Error())
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Error al registrar usuario")
		return
	}

	respondWithJSON(w, http.StatusCreated, authResponse)
}

// Login maneja el inicio de sesión
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validaciones
	if req.Email == "" || req.Password == "" {
		respondWithError(w, http.StatusBadRequest, "Email y contraseña son requeridos")
		return
	}

	// Autenticar usuario
	authResponse, err := h.authService.Login(&req)
	if err != nil {
		if strings.Contains(err.Error(), "credenciales inválidas") {
			respondWithError(w, http.StatusUnauthorized, "Email o contraseña incorrectos")
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Error al iniciar sesión")
		return
	}

	respondWithJSON(w, http.StatusOK, authResponse)
}

// Me obtiene la información del usuario autenticado
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	// Obtener token del header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		respondWithError(w, http.StatusUnauthorized, "Token no proporcionado")
		return
	}

	// Extraer token (formato: "Bearer TOKEN")
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		respondWithError(w, http.StatusUnauthorized, "Formato de token inválido")
		return
	}

	// Validar token
	claims, err := utils.ValidateToken(tokenParts[1], h.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Token inválido o expirado")
		return
	}

	// Obtener usuario
	user, err := h.authService.GetUserByID(claims.UserID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Usuario no encontrado")
		return
	}

	respondWithJSON(w, http.StatusOK, user)
}

// Funciones auxiliares para respuestas JSON
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

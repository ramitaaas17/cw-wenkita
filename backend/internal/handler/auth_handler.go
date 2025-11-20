package handler

import (
	"net/http"
	"wenka-backend/internal/service"

	"github.com/gin-gonic/gin"
)

// AuthHandler maneja las peticiones HTTP relacionadas con autenticación
type AuthHandler struct {
	authService *service.AuthService
}

// NewAuthHandler crea una nueva instancia de AuthHandler
// Inyección de dependencias: recibe el servicio de autenticación
func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register maneja la petición de registro de usuario
// POST /api/register
func (h *AuthHandler) Register(c *gin.Context) {
	var input service.RegisterInput

	// Validar y parsear el JSON del body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	// Llamar al servicio para registrar el usuario
	response, err := h.authService.Register(input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Respuesta exitosa
	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuario registrado exitosamente",
		"data":    response,
	})
}

// Login maneja la petición de inicio de sesión
// POST /api/login
func (h *AuthHandler) Login(c *gin.Context) {
	var input service.LoginInput

	// Validar y parsear el JSON del body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	// Llamar al servicio para autenticar
	response, err := h.authService.Login(input)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Respuesta exitosa
	c.JSON(http.StatusOK, gin.H{
		"message": "Inicio de sesión exitoso",
		"data":    response,
	})
}

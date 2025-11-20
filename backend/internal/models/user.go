package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Nombre    string    `json:"nombre"`
	Apellido  string    `json:"apellido"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // No se incluye en JSON
	Telefono  string    `json:"telefono,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// RegisterRequest estructura para el registro
type RegisterRequest struct {
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Telefono string `json:"telefono,omitempty"`
}

// LoginRequest estructura para el login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse respuesta de autenticación
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

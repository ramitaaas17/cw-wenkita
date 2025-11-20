package service

import (
	"errors"
	"os"
	"time"
	"wenka-backend/internal/models"
	"wenka-backend/internal/repository"

	"github.com/golang-jwt/jwt/v5"
)

// AuthService maneja la lógica de autenticación
type AuthService struct {
	userRepo *repository.UserRepository
}

// NewAuthService crea una nueva instancia de AuthService
// Inyección de dependencias: recibe el repositorio de usuarios
func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{
		userRepo: userRepo,
	}
}

// RegisterInput datos necesarios para registrar un usuario
type RegisterInput struct {
	Nombre   string `json:"nombre" binding:"required"`
	Apellido string `json:"apellido" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Telefono string `json:"telefono"`
}

// LoginInput datos necesarios para iniciar sesión
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse respuesta de autenticación con token
type AuthResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

// Register registra un nuevo usuario
func (s *AuthService) Register(input RegisterInput) (*AuthResponse, error) {
	// Verificar si el email ya existe
	existingUser, _ := s.userRepo.FindByEmail(input.Email)
	if existingUser != nil {
		return nil, errors.New("el email ya está registrado")
	}

	// Crear nuevo usuario
	user := &models.User{
		Nombre:   input.Nombre,
		Apellido: input.Apellido,
		Email:    input.Email,
		Password: input.Password,
		Telefono: input.Telefono,
	}

	// Encriptar contraseña
	if err := user.HashPassword(); err != nil {
		return nil, err
	}

	// Guardar en base de datos
	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Generar token JWT
	token, err := s.generateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// Login autentica un usuario existente
func (s *AuthService) Login(input LoginInput) (*AuthResponse, error) {
	// Buscar usuario por email
	user, err := s.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	// Verificar contraseña
	if !user.CheckPassword(input.Password) {
		return nil, errors.New("credenciales inválidas")
	}

	// Generar token JWT
	token, err := s.generateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// generateToken genera un token JWT para el usuario
func (s *AuthService) generateToken(userID uint) (string, error) {
	// Obtener la clave secreta del entorno o usar una por defecto
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "tu-clave-secreta-super-segura-cambiala-en-produccion"
	}

	// Crear las claims (datos que irán en el token)
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // Token válido por 7 días
		"iat":     time.Now().Unix(),
	}

	// Crear el token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar el token
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

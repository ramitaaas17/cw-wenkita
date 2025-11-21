// backend/internal/services/auth_service.go
package services

import (
	"errors"
	"fmt"

	"github.com/wenka/backend/internal/models"
	"github.com/wenka/backend/internal/repositories"
	"github.com/wenka/backend/internal/utils"
)

type AuthService struct {
	userRepo  *repositories.UserRepository
	jwtSecret string
}

// NewAuthService crea una nueva instancia del servicio
func NewAuthService(userRepo *repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

// Register registra un nuevo usuario
func (s *AuthService) Register(req *models.RegisterRequest) (*models.AuthResponse, error) {
	// Validar que el email no exista
	existingUser, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("error al verificar email: %v", err)
	}

	if existingUser != nil {
		return nil, errors.New("el email ya está registrado")
	}

	// Hashear la contraseña
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("error al hashear contraseña: %v", err)
	}

	// Crear el usuario
	user := &models.User{
		Nombre:   req.Nombre,
		Apellido: req.Apellido,
		Email:    req.Email,
		Password: hashedPassword,
		Telefono: req.Telefono,
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	// Generar token
	token, err := utils.GenerateToken(user.ID, user.Email, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("error al generar token: %v", err)
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// Login autentica a un usuario
func (s *AuthService) Login(req *models.LoginRequest) (*models.AuthResponse, error) {
	// Buscar usuario por email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("error al buscar usuario: %v", err)
	}

	if user == nil {
		return nil, errors.New("credenciales inválidas")
	}

	// Verificar contraseña
	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("credenciales inválidas")
	}

	// Generar token
	token, err := utils.GenerateToken(user.ID, user.Email, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("error al generar token: %v", err)
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// GetUserByID obtiene un usuario por su ID
func (s *AuthService) GetUserByID(id int) (*models.User, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, errors.New("usuario no encontrado")
	}

	return user, nil
}

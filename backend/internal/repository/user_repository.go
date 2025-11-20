package repository

import (
	"wenka-backend/internal/models"

	"gorm.io/gorm"
)

// UserRepository maneja las operaciones de base de datos para usuarios
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository crea una nueva instancia de UserRepository
// Inyección de dependencias: recibe la conexión a la base de datos
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

// Create crea un nuevo usuario en la base de datos
func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

// FindByEmail busca un usuario por su email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByID busca un usuario por su ID
func (r *UserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Update actualiza los datos de un usuario
func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

// Delete elimina un usuario (soft delete)
func (r *UserRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

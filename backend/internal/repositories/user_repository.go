// backend/internal/repositories/user_repository.go
package repositories

import (
	"fmt"

	"github.com/wenka/backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository crea una nueva instancia del repositorio
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create inserta un nuevo usuario en la base de datos
func (r *UserRepository) Create(user *models.User) error {
	result := r.db.Create(user)
	if result.Error != nil {
		return fmt.Errorf("error al crear usuario: %v", result.Error)
	}
	return nil
}

// FindByEmail busca un usuario por su email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	result := r.db.Where("email = ?", email).First(&user)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("error al buscar usuario: %v", result.Error)
	}

	return &user, nil
}

// FindByID busca un usuario por su ID
func (r *UserRepository) FindByID(id int) (*models.User, error) {
	var user models.User
	result := r.db.First(&user, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("error al buscar usuario: %v", result.Error)
	}

	return &user, nil
}

package repositories

import (
	"database/sql"
	"fmt"

	"github.com/wenka/backend/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

// NewUserRepository crea una nueva instancia del repositorio
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create inserta un nuevo usuario en la base de datos
func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO usuarios (nombre, apellido, email, password, telefono, created_at)
		VALUES (?, ?, ?, ?, ?, NOW())
	`

	result, err := r.db.Exec(query, user.Nombre, user.Apellido, user.Email, user.Password, user.Telefono)
	if err != nil {
		return fmt.Errorf("error al crear usuario: %v", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error al obtener ID: %v", err)
	}

	user.ID = int(id)
	return nil
}

// FindByEmail busca un usuario por su email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, nombre, apellido, email, password, telefono, created_at
		FROM usuarios
		WHERE email = ?
	`

	user := &models.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Nombre,
		&user.Apellido,
		&user.Email,
		&user.Password,
		&user.Telefono,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, fmt.Errorf("error al buscar usuario: %v", err)
	}

	return user, nil
}

// FindByID busca un usuario por su ID
func (r *UserRepository) FindByID(id int) (*models.User, error) {
	query := `
		SELECT id, nombre, apellido, email, telefono, created_at
		FROM usuarios
		WHERE id = ?
	`

	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Nombre,
		&user.Apellido,
		&user.Email,
		&user.Telefono,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, fmt.Errorf("error al buscar usuario: %v", err)
	}

	return user, nil
}

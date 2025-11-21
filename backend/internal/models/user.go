// backend/internal/models/user.go
package models

import "time"

type User struct {
	ID        int       `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	Nombre    string    `json:"nombre" gorm:"column:nombre;type:varchar(100);not null"`
	Apellido  string    `json:"apellido" gorm:"column:apellido;type:varchar(100);not null"`
	Email     string    `json:"email" gorm:"column:email;type:varchar(255);uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"column:password;type:varchar(255);not null"`
	Telefono  string    `json:"telefono,omitempty" gorm:"column:telefono;type:varchar(20)"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at;autoCreateTime"`
}

// TableName especifica el nombre de la tabla
func (User) TableName() string {
	return "usuarios"
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

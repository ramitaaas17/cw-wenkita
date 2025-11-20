package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// User representa un usuario del sistema
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Nombre    string    `gorm:"size:100;not null" json:"nombre"`
	Apellido  string    `gorm:"size:100;not null" json:"apellido"`
	Email     string    `gorm:"size:100;unique;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"` // El "-" evita que se muestre en JSON
	Telefono  string    `gorm:"size:20" json:"telefono"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// TableName especifica el nombre de la tabla en la base de datos
func (User) TableName() string {
	return "users"
}

// HashPassword encripta la contraseña del usuario
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword verifica si la contraseña proporcionada es correcta
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

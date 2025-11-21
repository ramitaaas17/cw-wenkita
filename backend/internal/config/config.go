// backend/internal/config/config.go
package config

import (
	"fmt"
	"os"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
	ServerPort string
}

// LoadConfig carga las variables de entorno
func LoadConfig() *Config {
	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "wenka_user"),
		DBPassword: getEnv("DB_PASSWORD", "wenka_secret"),
		DBName:     getEnv("DB_NAME", "wenka_db"),
		JWTSecret:  getEnv("JWT_SECRET", "secreto-clinica-wenka-dev"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
	}
}

// GetDSN retorna el Data Source Name para MySQL
func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.DBUser,
		c.DBPassword,
		c.DBHost,
		c.DBPort,
		c.DBName,
	)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

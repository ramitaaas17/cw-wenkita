// backend/internal/database/database.go
package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Connect establece la conexión con la base de datos usando GORM
func Connect(dsn string) (*gorm.DB, error) {
	// Configurar logger de GORM
	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	}

	// Intentar conectar con reintentos
	var db *gorm.DB
	var err error

	for i := 0; i < 10; i++ {
		db, err = gorm.Open(mysql.Open(dsn), config)
		if err == nil {
			// Configurar el pool de conexiones
			sqlDB, err := db.DB()
			if err != nil {
				return nil, fmt.Errorf("error al obtener SQL DB: %v", err)
			}

			sqlDB.SetMaxOpenConns(25)
			sqlDB.SetMaxIdleConns(5)
			sqlDB.SetConnMaxLifetime(5 * time.Minute)

			// Verificar la conexión
			if err := sqlDB.Ping(); err == nil {
				log.Println("✓ Conectado a la base de datos MySQL con GORM")
				return db, nil
			}
		}

		log.Printf("Intento %d: Esperando a que la BD esté lista...", i+1)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("no se pudo conectar a la base de datos después de 10 intentos: %v", err)
}

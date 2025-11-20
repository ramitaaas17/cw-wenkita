package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// Connect establece la conexión con la base de datos
func Connect(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("error al abrir conexión: %v", err)
	}

	// Configuración del pool de conexiones
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verificar la conexión con reintentos
	for i := 0; i < 10; i++ {
		err = db.Ping()
		if err == nil {
			log.Println("✓ Conectado a la base de datos MySQL")
			return db, nil
		}
		log.Printf("Intento %d: Esperando a que la BD esté lista...", i+1)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("no se pudo conectar a la base de datos después de 10 intentos: %v", err)
}

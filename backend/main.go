package main

import (
	"log"
	"os"
	"wenka-backend/internal/config"
	"wenka-backend/internal/handler"
	"wenka-backend/internal/models"
	"wenka-backend/internal/repository"
	"wenka-backend/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Inicializar Base de Datos
	db := config.InitDB()

	// AutoMigrate: Crea/Actualiza las tablas en la BD basándose en los Structs
	// Incluye User (auth) y todos los modelos médicos de medical.go
	err := db.AutoMigrate(
		&models.User{},
		&models.Especialidad{},
		&models.Especialista{},
		&models.Paciente{},
		&models.Tratamiento{},
		&models.Cita{},
		&models.HistorialClinico{},
		&models.Pago{},
	)
	if err != nil {
		log.Fatalf("[FATAL] Error en migracion de base de datos: %v", err)
	}
	log.Println("[INFO] Migracion de base de datos completada")

	// 2. Inyección de Dependencias (Configuración del módulo de Auth)
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	// 3. Configurar Router (Gin)
	r := gin.Default()

	// Middleware CORS (Permite peticiones desde el Frontend en localhost:3000)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 4. Definir Rutas
	api := r.Group("/api")
	{
		api.POST("/login", authHandler.Login)
		api.POST("/register", authHandler.Register)
	}

	// 5. Iniciar Servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[INFO] Servidor corriendo en puerto %s\n", port)
	r.Run(":" + port)
}

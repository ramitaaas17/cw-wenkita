package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/wenka/backend/internal/config"
	"github.com/wenka/backend/internal/database"
	"github.com/wenka/backend/internal/handlers"
	"github.com/wenka/backend/internal/middleware"
	"github.com/wenka/backend/internal/repositories"
	"github.com/wenka/backend/internal/services"
)

func main() {
	// Cargar configuración
	cfg := config.LoadConfig()

	// Conectar a la base de datos
	db, err := database.Connect(cfg.GetDSN())
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// Inicializar repositorios
	userRepo := repositories.NewUserRepository(db)

	// Inicializar servicios
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)

	// Inicializar handlers
	authHandler := handlers.NewAuthHandler(authService, cfg.JWTSecret)

	// Configurar rutas
	router := mux.NewRouter()

	// Grupo de rutas para autenticación
	authRouter := router.PathPrefix("/api/auth").Subrouter()
	authRouter.HandleFunc("/register", authHandler.Register).Methods("POST")
	authRouter.HandleFunc("/login", authHandler.Login).Methods("POST")
	authRouter.HandleFunc("/me", authHandler.Me).Methods("GET")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Aplicar middleware CORS
	handler := middleware.CORS(router)

	// Iniciar servidor
	serverAddr := ":" + cfg.ServerPort
	log.Printf("🚀 Servidor iniciado en http://localhost%s", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, handler))
}

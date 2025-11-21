// backend/cmd/server/main.go
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/wenka/backend/internal/config"
	"github.com/wenka/backend/internal/database"
	"github.com/wenka/backend/internal/handlers"
	"github.com/wenka/backend/internal/middleware"
	"github.com/wenka/backend/internal/repositories"
	"github.com/wenka/backend/internal/services"
)

func main() {
	cfg := config.LoadConfig()

	db, err := database.Connect(cfg.GetDSN())
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Error al obtener SQL DB: %v", err)
	}
	defer sqlDB.Close()

	// Inicializar repositorios
	userRepo := repositories.NewUserRepository(db)
	appointmentRepo := repositories.NewAppointmentRepository(db)

	// Inicializar servicios
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	emailService := services.NewEmailService()
	appointmentService := services.NewAppointmentService(appointmentRepo, emailService)

	// Inicializar handlers
	authHandler := handlers.NewAuthHandler(authService, cfg.JWTSecret)
	appointmentHandler := handlers.NewAppointmentHandler(appointmentService, cfg.JWTSecret)

	// Configurar rutas
	router := mux.NewRouter()

	// Rutas de autenticación (públicas)
	authRouter := router.PathPrefix("/api/auth").Subrouter()
	authRouter.HandleFunc("/register", authHandler.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", authHandler.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", authHandler.Me).Methods("GET", "OPTIONS")

	// RUTA PÚBLICA para confirmar cita (especialistas desde email)
	// IMPORTANTE: Esta debe ir ANTES de las rutas protegidas
	router.HandleFunc("/api/appointments/{id:[0-9]+}/confirm", appointmentHandler.ConfirmAppointment).Methods("GET", "POST", "PUT", "OPTIONS")

	// Rutas de citas (requieren autenticación)
	appointmentsRouter := router.PathPrefix("/api/appointments").Subrouter()
	appointmentsRouter.HandleFunc("", appointmentHandler.GetAppointments).Methods("GET", "OPTIONS")
	appointmentsRouter.HandleFunc("", appointmentHandler.CreateAppointment).Methods("POST", "OPTIONS")
	appointmentsRouter.HandleFunc("/{id:[0-9]+}", appointmentHandler.GetAppointmentByID).Methods("GET", "OPTIONS")
	appointmentsRouter.HandleFunc("/{id:[0-9]+}", appointmentHandler.CancelAppointment).Methods("DELETE", "OPTIONS")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET", "OPTIONS")

	// Aplicar middleware CORS
	handler := middleware.CORS(router)

	// Iniciar servidor
	serverAddr := ":" + cfg.ServerPort

	// Obtener variables de entorno directamente
	smtpUser := os.Getenv("SMTP_USERNAME")
	if smtpUser == "" {
		smtpUser = "modo desarrollo"
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	log.Printf(" Servidor iniciado en http://localhost%s", serverAddr)
	log.Printf(" Email configurado para: %s", smtpUser)
	log.Printf(" Frontend URL: %s", frontendURL)
	log.Fatal(http.ListenAndServe(serverAddr, handler))
}

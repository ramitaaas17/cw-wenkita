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
	authRouter.HandleFunc("/register", authHandler.Register).Methods("POST")
	authRouter.HandleFunc("/login", authHandler.Login).Methods("POST")
	authRouter.HandleFunc("/me", authHandler.Me).Methods("GET")

	// Rutas de citas (requieren autenticación)
	appointmentsRouter := router.PathPrefix("/api/appointments").Subrouter()
	appointmentsRouter.HandleFunc("", appointmentHandler.GetAppointments).Methods("GET")
	appointmentsRouter.HandleFunc("", appointmentHandler.CreateAppointment).Methods("POST")
	appointmentsRouter.HandleFunc("/{id:[0-9]+}", appointmentHandler.GetAppointmentByID).Methods("GET")
	appointmentsRouter.HandleFunc("/{id:[0-9]+}", appointmentHandler.CancelAppointment).Methods("DELETE")

	// Ruta pública para confirmar cita (especialistas)
	router.HandleFunc("/api/appointments/{id:[0-9]+}/confirm", appointmentHandler.ConfirmAppointment).Methods("POST")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Aplicar middleware CORS
	handler := middleware.CORS(router)

	// Iniciar servidor
	serverAddr := ":" + cfg.ServerPort
	log.Printf("Servidor iniciado en http://localhost%s", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, handler))
}

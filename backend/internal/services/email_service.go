package services

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/wenka/backend/internal/models"
)

type EmailService struct {
	smtpHost     string
	smtpPort     string
	smtpUsername string
	smtpPassword string
	fromEmail    string
}

// NewEmailService crea una nueva instancia del servicio de email
func NewEmailService() *EmailService {
	return &EmailService{
		smtpHost:     getEnvOrDefault("SMTP_HOST", "smtp.gmail.com"),
		smtpPort:     getEnvOrDefault("SMTP_PORT", "587"),
		smtpUsername: getEnvOrDefault("SMTP_USERNAME", ""),
		smtpPassword: getEnvOrDefault("SMTP_PASSWORD", ""),
		fromEmail:    getEnvOrDefault("FROM_EMAIL", "noreply@clinicawenka.com"),
	}
}

// SendAppointmentConfirmationToPatient envía confirmación de cita al paciente
func (s *EmailService) SendAppointmentConfirmationToPatient(appointment *models.AppointmentWithDetails) error {
	subject := "Confirmación de Cita - Clínica Wenka"

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%%, #7c3aed 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #2563eb; }
        .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Cita Confirmada!</h1>
            <p>Tu cita ha sido agendada exitosamente</p>
        </div>
        <div class="content">
            <p>Estimado(a) <strong>%s</strong>,</p>
            <p>Tu cita en Clínica Wenka ha sido registrada correctamente. A continuación los detalles:</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="label">Servicio:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Fecha:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Hora:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Especialista:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Estado:</span> %s
                </div>
            </div>

            <p><strong>Importante:</strong></p>
            <ul>
                <li>Por favor llega 10 minutos antes de tu cita</li>
                <li>Trae tu identificación oficial</li>
                <li>Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
            </ul>

            <div class="footer">
                <p>Clínica Wenka - Tu salud es nuestra prioridad</p>
                <p>Teléfono: (555) 123-4567</p>
            </div>
        </div>
    </div>
</body>
</html>
	`,
		appointment.NombrePaciente,
		appointment.Tratamiento,
		appointment.FechaHora.Format("02/01/2006"),
		appointment.FechaHora.Format("15:04"),
		appointment.NombreEspecialista,
		getEstadoLabel(appointment.Estado),
	)

	return s.sendEmail(appointment.EmailPaciente, subject, body)
}

// SendAppointmentNotificationToSpecialist envía notificación al especialista
func (s *EmailService) SendAppointmentNotificationToSpecialist(appointment *models.AppointmentWithDetails) error {
	subject := "Nueva Cita Agendada - Clínica Wenka"

	confirmURL := fmt.Sprintf("http://localhost:3000/appointments/confirm/%d", appointment.ID)

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%%, #2563eb 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #7c3aed; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #7c3aed; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2563eb 0%%, #7c3aed 100%%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nueva Cita Agendada</h1>
            <p>Requiere tu confirmación</p>
        </div>
        <div class="content">
            <p>Dr(a). <strong>%s</strong>,</p>
            <p>Se ha agendado una nueva cita que requiere tu confirmación:</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="label">Paciente:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Teléfono:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Servicio:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Fecha:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Hora:</span> %s
                </div>
                <div class="info-row">
                    <span class="label">Motivo:</span> %s
                </div>
            </div>

            <div style="text-align: center;">
                <a href="%s" class="button">Confirmar Cita</a>
            </div>

            <p><em>Si no puedes atender esta cita, por favor notifica al paciente lo antes posible.</em></p>

            <div class="footer">
                <p>Clínica Wenka - Sistema de Gestión de Citas</p>
            </div>
        </div>
    </div>
</body>
</html>
	`,
		appointment.NombreEspecialista,
		appointment.NombrePaciente,
		appointment.TelefonoPaciente,
		appointment.Tratamiento,
		appointment.FechaHora.Format("02/01/2006"),
		appointment.FechaHora.Format("15:04"),
		appointment.Motivo,
		confirmURL,
	)

	return s.sendEmail(appointment.EmailEspecialista, subject, body)
}

// sendEmail función auxiliar para enviar emails
func (s *EmailService) sendEmail(to, subject, body string) error {
	// Si no hay configuración SMTP, solo logear (modo desarrollo)
	if s.smtpUsername == "" || s.smtpPassword == "" {
		fmt.Printf("\n=== EMAIL (Modo Desarrollo) ===\n")
		fmt.Printf("Para: %s\n", to)
		fmt.Printf("Asunto: %s\n", subject)
		fmt.Printf("================================\n\n")
		return nil
	}

	// Configurar mensaje
	message := []byte(
		"From: " + s.fromEmail + "\r\n" +
			"To: " + to + "\r\n" +
			"Subject: " + subject + "\r\n" +
			"MIME-Version: 1.0\r\n" +
			"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
			"\r\n" +
			body + "\r\n")

	// Autenticación SMTP
	auth := smtp.PlainAuth("", s.smtpUsername, s.smtpPassword, s.smtpHost)

	// Enviar email
	addr := s.smtpHost + ":" + s.smtpPort
	err := smtp.SendMail(addr, auth, s.fromEmail, []string{to}, message)
	if err != nil {
		return fmt.Errorf("error al enviar email: %v", err)
	}

	fmt.Printf("Email enviado exitosamente a: %s\n", to)
	return nil
}

// getEstadoLabel retorna el label legible del estado
func getEstadoLabel(estado string) string {
	labels := map[string]string{
		"programada": "Programada",
		"confirmada": "Confirmada",
		"cancelada":  "Cancelada",
		"completada": "Completada",
		"en_curso":   "En Curso",
		"no_asistio": "No Asistió",
	}

	if label, ok := labels[estado]; ok {
		return label
	}
	return estado
}

// getEnvOrDefault obtiene una variable de entorno o retorna un valor por defecto
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

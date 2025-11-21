// backend/internal/services/email_service.go
package services

import (
	"encoding/base64"
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
	backendURL   string
}

func NewEmailService() *EmailService {
	return &EmailService{
		smtpHost:     getEnvOrDefault("SMTP_HOST", "smtp.gmail.com"),
		smtpPort:     getEnvOrDefault("SMTP_PORT", "587"),
		smtpUsername: getEnvOrDefault("SMTP_USERNAME", ""),
		smtpPassword: getEnvOrDefault("SMTP_PASSWORD", ""),
		fromEmail:    getEnvOrDefault("FROM_EMAIL", "noreply@clinicawenka.com"),
		backendURL:   getEnvOrDefault("BACKEND_URL", "http://localhost:8080"),
	}
}

func (s *EmailService) SendAppointmentConfirmationToPatient(appointment *models.AppointmentWithDetails) error {
	subject := "Cita Confirmada - Clínica Wenka"

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1e3a5f;
            background: linear-gradient(180deg, #1e3a8a 0%%, #3b82f6 50%%, #e0f2fe 100%%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .header {
            background: linear-gradient(180deg, #1e3a8a 0%%, #2563eb 100%%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 30px;
            background: #ffffff;
            border-radius: 50%% 50%% 0 0 / 100%% 100%% 0 0;
        }
        .icon-wrapper {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.15);
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
        }
        .icon-wrapper svg {
            width: 45px;
            height: 45px;
            fill: #ffffff;
        }
        .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            color: #1e3a5f;
            margin-bottom: 16px;
            font-weight: 500;
        }
        .intro-text {
            color: #475569;
            font-size: 15px;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .appointment-card {
            background: linear-gradient(180deg, #f0f9ff 0%%, #ffffff 100%%);
            border: 2px solid #bfdbfe;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
        }
        .detail-row {
            display: flex;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #e0f2fe;
        }
        .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .detail-row:first-child {
            padding-top: 0;
        }
        .icon-label {
            display: flex;
            align-items: center;
            min-width: 140px;
            font-weight: 600;
            color: #1e40af;
            font-size: 14px;
        }
        .icon-label svg {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            fill: #3b82f6;
        }
        .detail-value {
            color: #1e3a5f;
            font-size: 15px;
            font-weight: 500;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: linear-gradient(135deg, #059669 0%%, #10b981 100%%);
            color: #ffffff;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.3px;
            box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3);
        }
        .info-box {
            background: linear-gradient(135deg, #fef3c7 0%%, #fef9e7 100%%);
            border-left: 4px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .info-box-title {
            color: #92400e;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }
        .info-box-title svg {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            fill: #d97706;
        }
        .info-list {
            list-style: none;
        }
        .info-list li {
            color: #78350f;
            margin: 12px 0;
            padding-left: 28px;
            position: relative;
            font-size: 14px;
            line-height: 1.6;
        }
        .info-list li::before {
            content: '•';
            position: absolute;
            left: 12px;
            color: #d97706;
            font-size: 18px;
            font-weight: bold;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%%, #cbd5e1 50%%, transparent 100%%);
            margin: 35px 0;
        }
        .footer {
            background: linear-gradient(180deg, #f8fafc 0%%, #e2e8f0 100%%);
            padding: 40px;
            text-align: center;
        }
        .footer-logo {
            font-size: 22px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
        }
        .footer-tagline {
            color: #475569;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .footer-contact {
            color: #64748b;
            font-size: 14px;
            margin: 8px 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .footer-contact svg {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            fill: #64748b;
        }
        .footer-note {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #cbd5e1;
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon-wrapper">
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            </div>
            <h1>Cita Confirmada</h1>
            <p>Tu cita ha sido agendada exitosamente</p>
        </div>
        
        <div class="content">
            <p class="greeting">Estimado(a) <strong>%s</strong>,</p>
            <p class="intro-text">Nos complace confirmar que tu cita en Clínica Wenka ha sido registrada. A continuación encontrarás todos los detalles de tu próxima consulta:</p>
            
            <div class="appointment-card">
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                        Servicio
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                        Fecha
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        Hora
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        Especialista
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Estado
                    </span>
                    <span class="detail-value"><span class="status-badge">%s</span></span>
                </div>
            </div>

            <div class="info-box">
                <div class="info-box-title">
                    <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                    Información importante
                </div>
                <ul class="info-list">
                    <li>Por favor llega 10 minutos antes de tu cita</li>
                    <li>Trae tu identificación oficial</li>
                    <li>Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
                </ul>
            </div>
            
            <div class="divider"></div>
        </div>

        <div class="footer">
            <div class="footer-logo">Clínica Wenka</div>
            <p class="footer-tagline">Tu salud es nuestra prioridad</p>
            <div class="footer-contact">
                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Teléfono: (555) 123-4567
            </div>
            <p class="footer-note">
                Este es un mensaje automático, por favor no respondas a este correo.<br>
                Si tienes alguna duda, contáctanos por teléfono.
            </p>
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

func (s *EmailService) SendAppointmentNotificationToSpecialist(appointment *models.AppointmentWithDetails) error {
	subject := "Nueva Cita Agendada - Clínica Wenka"

	confirmURL := fmt.Sprintf("%s/api/appointments/%d/confirm", s.backendURL, appointment.ID)

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1e3a5f;
            background: linear-gradient(180deg, #1e3a8a 0%%, #3b82f6 50%%, #e0f2fe 100%%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .header {
            background: linear-gradient(180deg, #1e3a8a 0%%, #2563eb 100%%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 30px;
            background: #ffffff;
            border-radius: 50%% 50%% 0 0 / 100%% 100%% 0 0;
        }
        .icon-wrapper {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.15);
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
        }
        .icon-wrapper svg {
            width: 45px;
            height: 45px;
            fill: #ffffff;
        }
        .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            color: #1e3a5f;
            margin-bottom: 16px;
            font-weight: 500;
        }
        .intro-text {
            color: #475569;
            font-size: 15px;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .appointment-card {
            background: linear-gradient(180deg, #f0f9ff 0%%, #ffffff 100%%);
            border: 2px solid #bfdbfe;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
        }
        .detail-row {
            display: flex;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #e0f2fe;
        }
        .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .detail-row:first-child {
            padding-top: 0;
        }
        .icon-label {
            display: flex;
            align-items: center;
            min-width: 140px;
            font-weight: 600;
            color: #1e40af;
            font-size: 14px;
        }
        .icon-label svg {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            fill: #3b82f6;
        }
        .detail-value {
            color: #1e3a5f;
            font-size: 15px;
            font-weight: 500;
            flex: 1;
        }
        .button-wrapper {
            text-align: center;
            margin: 35px 0;
        }
        .confirm-button {
            display: inline-block;
            padding: 18px 45px;
            background: linear-gradient(180deg, #1e3a8a 0%%, #2563eb 100%%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.3px;
            box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.4);
            transition: all 0.3s ease;
        }
        .alert-box {
            background: linear-gradient(135deg, #fef3c7 0%%, #fef9e7 100%%);
            border-left: 4px solid #f59e0b;
            border-radius: 12px;
            padding: 20px 25px;
            margin: 30px 0;
            display: flex;
            align-items: flex-start;
        }
        .alert-box svg {
            width: 22px;
            height: 22px;
            fill: #d97706;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .alert-content {
            flex: 1;
        }
        .alert-title {
            color: #92400e;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .alert-text {
            color: #78350f;
            font-size: 14px;
            line-height: 1.6;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%%, #cbd5e1 50%%, transparent 100%%);
            margin: 35px 0;
        }
        .footer {
            background: linear-gradient(180deg, #f8fafc 0%%, #e2e8f0 100%%);
            padding: 40px;
            text-align: center;
        }
        .footer-logo {
            font-size: 22px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
        }
        .footer-tagline {
            color: #475569;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 25px;
        }
        .footer-note {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #cbd5e1;
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon-wrapper">
                <svg viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
            </div>
            <h1>Nueva Cita Agendada</h1>
            <p>Requiere tu confirmación</p>
        </div>
        
        <div class="content">
            <p class="greeting">Dr(a). <strong>%s</strong>,</p>
            <p class="intro-text">Se ha registrado una nueva cita en el sistema que requiere tu atención y confirmación. A continuación los detalles de la consulta:</p>
            
            <div class="appointment-card">
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        Paciente
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        Teléfono
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                        Servicio
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                        Fecha
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        Hora
                    </span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="icon-label">
                        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                        Motivo
                    </span>
                    <span class="detail-value">%s</span>
                </div>
            </div>

            <div class="button-wrapper">
                <a href="%s" class="confirm-button">
                    Confirmar Cita
                </a>
            </div>

            <div class="alert-box">
                <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                <div class="alert-content">
                    <div class="alert-title">Nota Importante</div>
                    <div class="alert-text">Si no puedes atender esta cita, por favor notifica al paciente lo antes posible para reagendar.</div>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>

        <div class="footer">
            <div class="footer-logo">Clínica Wenka</div>
            <p class="footer-tagline">Sistema de Gestión de Citas</p>
            <p class="footer-note">
                Este es un mensaje automático del sistema.<br>
                Si tienes alguna duda sobre esta cita, contacta al personal administrativo.
            </p>
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

func (s *EmailService) sendEmail(to, subject, body string) error {
	if s.smtpUsername == "" || s.smtpPassword == "" {
		fmt.Printf("\n=== EMAIL (Modo Desarrollo) ===\n")
		fmt.Printf("Para: %s\n", to)
		fmt.Printf("Asunto: %s\n", subject)
		fmt.Printf("URL de confirmación en el email\n")
		fmt.Printf("================================\n\n")
		return nil
	}

	from := "From: " + s.fromEmail + "\r\n"
	toHeader := "To: " + to + "\r\n"
	subjectEncoded := "Subject: =?UTF-8?B?" + base64.StdEncoding.EncodeToString([]byte(subject)) + "?=\r\n"
	mime := "MIME-Version: 1.0\r\n"
	contentType := "Content-Type: text/html; charset=UTF-8\r\n"
	contentTransfer := "Content-Transfer-Encoding: 8bit\r\n"

	message := []byte(from + toHeader + subjectEncoded + mime + contentType + contentTransfer + "\r\n" + body + "\r\n")

	auth := smtp.PlainAuth("", s.smtpUsername, s.smtpPassword, s.smtpHost)

	addr := s.smtpHost + ":" + s.smtpPort
	err := smtp.SendMail(addr, auth, s.fromEmail, []string{to}, message)
	if err != nil {
		return fmt.Errorf("error al enviar email: %v", err)
	}

	fmt.Printf("Email enviado exitosamente a: %s\n", to)
	return nil
}

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

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

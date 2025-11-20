FROM golang:1.24-alpine

WORKDIR /app

# Instalar git y herramientas necesarias
RUN apk add --no-cache git

# Copiar archivos de dependencias
COPY go.mod go.sum ./

# Descargar dependencias
RUN go mod download

# Copiar todo el código fuente
COPY . .

# Verificar dependencias
RUN go mod tidy

# Exponer puerto
EXPOSE 8080

# Ejecutar desde el directorio cmd/server
CMD ["go", "run", "cmd/server/main.go"]
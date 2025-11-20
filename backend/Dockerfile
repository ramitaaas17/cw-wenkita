# Usa una imagen oficial de Go (versión ligera Alpine)
FROM golang:1.22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala git (necesario si alguna dependencia lo requiere)
RUN apk add --no-cache git

# Copia los archivos de gestión de dependencias primero
# Esto optimiza la caché de Docker: si no cambian estos archivos, no re-descarga todo
COPY go.mod go.sum ./

# Descarga las dependencias
RUN go mod download

# Copia el resto del código fuente del backend
COPY . .

# Asegura que las dependencias estén limpias y sincronizadas
RUN go mod tidy

# Expone el puerto del backend
EXPOSE 8080

# Comando para iniciar la aplicación en modo desarrollo
# Nota: Para producción idealmente se compila un binario, pero para dev esto está bien.
CMD ["go", "run", "main.go"]
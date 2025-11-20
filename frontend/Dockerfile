FROM node:20-alpine

WORKDIR /app

# Instala dependencias de compatibilidad necesarias para Alpine
RUN apk add --no-cache libc6-compat

# Copia los archivos de definición de paquetes
COPY package.json package-lock.json ./

# Instala dependencias. 
# Usamos 'npm install' en lugar de 'ci' para evitar problemas si el lockfile no está sincronizado,
# pero mantenemos legacy-peer-deps por si acaso.
RUN npm install --legacy-peer-deps

# Copia TODO el código fuente del frontend
COPY . .

# Variables de entorno para el contenedor
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
# Es crucial escuchar en 0.0.0.0 dentro de Docker
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Inicia en modo desarrollo (Hot Reload activo)
CMD ["npm", "run", "dev"]
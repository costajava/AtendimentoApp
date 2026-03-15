# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
# Se existir package-lock.json, descomente a linha abaixo
# COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/atendimento-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY firebase.json ./
COPY .env ./
COPY functions ./functions

WORKDIR /app/functions
RUN npm install

RUN npm install -g firebase-tools

EXPOSE 5001

# Comando por defecto: ejecutar en modo local
CMD ["npm", "run", "serve"]

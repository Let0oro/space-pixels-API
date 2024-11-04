# ARG NODE_VERSION=20.12.2

# # Usa la imagen oficial de Node.js como base
# FROM node:${NODE_VERSION}-alpine

# # Establece el directorio de trabajo dentro del contenedor
# WORKDIR /usr/src/app

# # Copia el archivo package.json y package-lock.json
# COPY package*.json ./

# # Instala las dependencias de la aplicación
# RUN npm install
# # RUN npm install --production

# # Copia el resto de tu código fuente al contenedor
# COPY . .

# # Expone el puerto en el que tu servidor escuchará
# EXPOSE 3000

# # Comando para ejecutar tu aplicación
# CMD ["npm", "run", "server"]




# ------------------------------
ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "server"]
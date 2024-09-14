ARG NODE_VERSION=20.12.2
# Change this version with the version in the original Dockerfile file


FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "server"]
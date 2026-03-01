# Dockerfile for InfluencerzHub Backend
FROM node:latest

WORKDIR /app

COPY backend/package.json ./
RUN npm install

COPY backend/ ./

CMD ["npm", "run", "dev"]
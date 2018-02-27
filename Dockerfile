#FROM ubuntu:16.04
FROM node:8
WORKDIR /app
COPY . ./
RUN apt-get update && apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++
RUN npm install
RUN npm run build
RUN touch /app/.env
CMD node dist/server.js


FROM node:9
WORKDIR /app

RUN apt-get update && apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

COPY . ./
RUN touch /app/.env
CMD ./run.sh


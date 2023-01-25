FROM node:19-alpine as base

WORKDIR /usr/src/app
COPY ./package*.json .

RUN npm install
COPY . .

ENV NODE_ENV=development



FROM base as production

ENV NODE_ENV=production
ENV NODE_PATH=./build

RUN npm run build
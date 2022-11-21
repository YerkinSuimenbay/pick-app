FROM ubuntu:latest
RUN apt-get -y update
RUN apt-get -y install git

FROM node:16-alpine AS base

WORKDIR /app
COPY ["package.json", "yarn.lock*","./"]

FROM base AS dev
RUN yarn install --frozen-lockfile
COPY . .
# RUN yarn migration:run
# This is our secret sauce
RUN git clone https://github.com/vishnubob/wait-for-it.git

CMD ["yarn", "start:dev"]

FROM base AS prod
RUN yarn install --frozen-lockfile --production
COPY . .
# RUN yarn migration:run
RUN yarn add global @nestjs/cli
RUN yarn build
# EXPOSE ${PORT}
CMD ["yarn", "start:prod"]

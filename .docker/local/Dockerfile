FROM node:18-bookworm-slim

RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install openssl ca-certificates curl

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY . .

RUN yarn install

CMD [ "yarn", "start:doc" ]

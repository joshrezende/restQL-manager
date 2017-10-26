FROM node:8.8-alpine
LABEL maintainer="Thúlio Costa <thulio.costa@b2wdigital.com>"

WORKDIR /app
ENV NODE_ENV=production

COPY LICENSE /app/LICENSE
COPY README.md /app/README.md
COPY public /app/public

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

COPY src /app/src
COPY server /app/server

RUN yarn build

CMD ["node", "server"]

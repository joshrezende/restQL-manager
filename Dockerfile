FROM node:8.8-alpine
LABEL maintainer="Thúlio Costa <thulio.costa@b2wdigital.com>"

WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3000

COPY LICENSE /app/LICENSE
COPY README.md /app/README.md
COPY public /app/public

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY .yarnclean /app/.yarnclean

RUN yarn install --production

COPY src /app/src

RUN yarn build

CMD ["node", "src/server"]

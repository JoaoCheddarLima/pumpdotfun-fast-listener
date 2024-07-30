FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./dist/

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start", "log"]
# Development stage
FROM node:20-alpine as development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

CMD ["yarn", "start:dev"]

# Production stage
FROM node:20-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]

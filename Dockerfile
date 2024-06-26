FROM node:18-alpine as development
RUN apk add python3 make g++

WORKDIR /usr/src/app

COPY package*.json prisma ./

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm rebuild bcrypt --build-from-source

RUN npm run build auth

FROM node:18-alpine as production
RUN apk add python3 make g++

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json prisma ./

RUN npm install --only=production
RUN npx prisma generate

COPY . .
RUN npm rebuild bcrypt --build-from-source

COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/auth/main.js"]
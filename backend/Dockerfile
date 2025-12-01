FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]
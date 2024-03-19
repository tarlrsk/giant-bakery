FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npx prisma migrate deploy
RUN npm run build


CMD ["npm", "start"]
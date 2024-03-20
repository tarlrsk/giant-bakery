FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build


CMD ["npm", "start"]
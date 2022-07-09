FROM node:lts

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY ./server.js ./

CMD ["npm", "start"]

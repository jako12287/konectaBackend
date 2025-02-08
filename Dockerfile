FROM node:20.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY .env ./

EXPOSE 3000

CMD ["npm", "start"]

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=postgres://postgres:postgres@localhost:6543/mydb?schema=public

ENV SERVER_PORT=2000

EXPOSE 2000

CMD [ "npm", "run", "dev" ]
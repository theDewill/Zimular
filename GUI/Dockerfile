FROM node:21-alpine

WORKDIR /src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD ["npm", "run", "dev"]

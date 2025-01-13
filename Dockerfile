FROM node:22-alpine

WORKDIR /app

COPY . .

RUN apk add --update alpine-sdk python3 g++ cairo-dev pango-dev giflib-dev font-dejavu

RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]
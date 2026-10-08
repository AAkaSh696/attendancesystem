FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5001

CMD ["node", "--dns-result-order=ipv4first", "index.js"]
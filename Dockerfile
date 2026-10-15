FROM node:22-alpine
ENV NODE_OPTIONS=--dns-result-order=ipv4first

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 5001

CMD ["npm", "start"]

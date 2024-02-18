FROM node:20.11.0

WORKDIR /usr/src/app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install \
  && npm install typescript -g

COPY . .

RUN tsc

EXPOSE 4000

CMD ["npm", "start"]
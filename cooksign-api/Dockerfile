FROM node:current-alpine3.17

LABEL key="Dhierry Joseph"

RUN mkdir -p /usr/src/back

WORKDIR /usr/src/back

COPY . /usr/src/back/

COPY package.json ./
COPY package-lock.json ./
RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start" ]

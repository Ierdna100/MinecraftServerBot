FROM node:22

WORKDIR /app

COPY bin /app/bin
COPY src /app/src
COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "run", "run"]
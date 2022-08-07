FROM node:16

WORKDIR /app

COPY server/package.json .
COPY yarn.lock .

RUN yarn

# Generate prisma files
COPY server/prisma prisma

# Download the latest build from the github CI and put it at server/build
COPY server/build build

ENV PORT=80
EXPOSE 80

CMD [ "node", "./build/index.js" ]


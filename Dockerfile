FROM node:16

WORKDIR /app

COPY server/package.json .
COPY server/yarn.lock .

RUN yarn

# Download the latest build from the github CI and put it at server/build
COPY server/build .

ENV PORT=80
EXPOSE 80

CMD [ "node", "./index.js" ]


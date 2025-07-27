FROM node:16

WORKDIR /app

COPY server/package.json .
COPY yarn.lock .

RUN yarn

# Generate prisma files
COPY server/src/prisma prisma
RUN yarn prismaGenerate

# Copy the server build to dist
COPY server/build dist

ENV PORT=80
EXPOSE 80

CMD [ "node", "./dist/server/index.js" ]


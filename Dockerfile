FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY server/package.json ./server/

# Enable Corepack for Yarn 4
RUN corepack enable

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy prisma schemas
COPY server/src/prisma ./server/src/prisma/

# Generate Prisma client
WORKDIR /app/server
RUN yarn prismaGenerate

# Copy the built server files from the build artifact
COPY server/dist ./server/dist

WORKDIR /app
ENV PORT=80
EXPOSE 80

CMD [ "node", "./server/dist/server/index.js" ]


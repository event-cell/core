FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY server/package.json ./server/

# Enable Corepack for Yarn 4
RUN corepack enable

# Install dependencies
RUN yarn install

# Copy prisma schemas and generated clients
COPY server/src/prisma ./server/src/prisma/

# Copy the built server files from the build artifact
COPY server/dist ./server/dist

# Create config file
RUN echo '{}' > ./server/dist/config.json

# Install production dependencies only
WORKDIR /app/server
RUN yarn workspaces focus --production
WORKDIR /app

WORKDIR /app
ENV PORT=80
EXPOSE 80

CMD [ "node", "./server/dist/server/index.js" ]


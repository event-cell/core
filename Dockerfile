FROM node:22-alpine

WORKDIR /app

# Copy everything needed (controlled by .dockerignore)
COPY . .

# Enable Corepack for Yarn 4
RUN corepack enable

# Create default config file
RUN echo '{}' > ./server/dist/config.json

ENV PORT=80
EXPOSE 80

CMD [ "node", "./server/dist/server/index.js" ]


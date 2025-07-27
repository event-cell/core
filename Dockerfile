FROM node:22-alpine

# Install rsync for live timing data uploads
RUN apk add --no-cache rsync

WORKDIR /app

# Copy everything needed (controlled by .dockerignore)
COPY . .

# Create default config file
RUN echo '{}' > ./server/dist/config.json

# Set NODE_PATH to include root node_modules for proper module resolution
ENV NODE_PATH=/app/node_modules
ENV PORT=80
EXPOSE 80

# Run the main server
CMD [ "node", "./server/dist/server/index.js" ]


#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the project
echo "Building the project..."
yarn build

echo "Setup complete! You can now run the CLI client with:"
echo "yarn start process-events -s <start_id> -e <end_id>" 
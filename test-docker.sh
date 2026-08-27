#!/bin/bash

# Docker test script with database mounts
# This script runs the Docker container with the Events directory and test data mounted

set -e  # Exit on any error

echo "🐳 Starting Docker test with database mounts..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the core directory."
    exit 1
fi

# Check if Events directory exists
if [ ! -d "Events" ]; then
    echo "❌ Error: Events directory not found. Please ensure you have the Events directory with database files."
    exit 1
fi

# Create test-data directory if it doesn't exist
if [ ! -d "test-data" ]; then
    echo "📁 Creating test-data directory..."
    mkdir -p test-data
    echo '{}' > test-data/config.json
fi

# Check if Docker image exists, build if not
if ! docker image inspect event-cell-core:local >/dev/null 2>&1; then
    echo "🔨 Building Docker image..."
    docker build -t event-cell-core:local .
fi

# Stop any existing container on port 3000
echo "🛑 Stopping any existing container on port 3000..."
docker ps -q --filter "publish=3000" | xargs -r docker stop

# Get the machine's IP address (macOS uses ipconfig; hostname -I is GNU/Linux only)
MACHINE_IP=$(ipconfig getifaddr en0 2>/dev/null \
  || ipconfig getifaddr en1 2>/dev/null \
  || hostname -I 2>/dev/null | awk '{print $1}')
[ -n "$MACHINE_IP" ] || MACHINE_IP="localhost"

echo "🚀 Starting Docker container..."
echo "   - Events directory mounted to /app/prisma/Events"
echo "   - Test data directory mounted to /data"
echo "   - Server will be available at:"
echo "     Local:  http://localhost:3000"
echo "     Remote: http://${MACHINE_IP}:3000"
echo "   - Remote access enabled (accessible from other machines on the network)"
echo ""
echo "Press Ctrl+C to stop the container"
echo ""

# Run the container
# The :z suffix relabels the mounted directories so SELinux (enforcing by
# default on Fedora) lets the container read them. It modifies the labels on
# the host directories, and is ignored on systems without SELinux.
docker run --rm -p 0.0.0.0:3000:80 \
  -v "$(pwd)/Events:/app/prisma/Events:z" \
  -v "$(pwd)/test-data:/data:z" \
  event-cell-core:local 
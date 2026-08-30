#!/bin/bash

# Docker test script against the published image
# Same mounts and ports as test-docker.sh, but runs the image built by the
# nightly workflow instead of building locally — so what is tested is what
# would actually be deployed.

set -e  # Exit on any error

IMAGE="${IMAGE:-ghcr.io/event-cell/core:main}"

echo "🐳 Starting Docker test against the published image..."
echo "   Image: ${IMAGE}"

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

# Always pull, so "latest" really is the latest. A private package needs a login
# first: gh auth token | docker login ghcr.io -u <your-github-user> --password-stdin
echo "⬇️  Pulling ${IMAGE}..."
if ! docker pull "$IMAGE"; then
    echo "❌ Error: could not pull ${IMAGE}."
    echo "   If the package is private, log in first:"
    echo "     gh auth token | docker login ghcr.io -u \$(gh api user --jq .login) --password-stdin"
    exit 1
fi

# Report what was pulled, so it is obvious which build is under test
echo "📦 Image under test:"
docker image inspect "$IMAGE" \
  --format '   digest:  {{index .RepoDigests 0}}
   created: {{.Created}}' 2>/dev/null || true

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
  "$IMAGE"

#!/bin/bash

# Local build script that duplicates GitHub Actions workflow
# This script builds the application the same way as the GitHub Actions workflow

set -e  # Exit on any error

echo "🚀 Starting local build (mimicking GitHub Actions workflow)..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the core directory."
    exit 1
fi

echo "📦 Installing dependencies..."
yarn

echo "🔧 Generating Prisma clients..."
cd server && yarn prismaGenerate && cd ..

echo "🏗️ Building client..."
cd client && yarn build && cd ..

echo "🏗️ Building server..."
cd server && yarn build && cd ..

echo "📁 Copying UI files to server..."
mkdir -p server/dist/server/ui
cp -r client/dist/* server/dist/server/ui/

echo "✅ Verifying build output..."
echo "Server build output:"
ls -la server/dist/
echo "Server dist/server:"
ls -la server/dist/server/
echo "Server UI directory:"
ls -la server/dist/server/ui/
echo "Node modules:"
ls -la node_modules/ | head -10
echo "Node modules size:"
du -sh node_modules/

echo "🎉 Local build completed successfully!"

echo "🐳 Building Docker image..."
docker build -t event-cell-core:local .

echo "🎉 Docker image built successfully!"
echo ""
echo "Next steps:"
echo "1. Run './test-docker.sh' to test with Docker and database files"
echo "2. Or run 'docker run --rm -p 3000:80 event-cell-core:local' to test without database files" 
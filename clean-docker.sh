#!/bin/bash

# Script to delete all Docker containers
# This script will remove all containers (running and stopped)

set -e  # Exit on any error

echo "🧹 Docker Container Cleanup Script"
echo "=================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Get count of containers
CONTAINER_COUNT=$(docker ps -aq | wc -l)

if [ "$CONTAINER_COUNT" -eq 0 ]; then
  echo "✅ No Docker containers found. Nothing to clean up."
  exit 0
fi

echo "📊 Found $CONTAINER_COUNT container(s) to remove:"
echo ""

# Show containers that will be removed
echo "Containers to be removed:"
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"
echo ""

# Ask for confirmation
read -p "⚠️  Are you sure you want to delete ALL Docker containers? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Operation cancelled."
  exit 0
fi

echo "🗑️  Removing all Docker containers..."

# Stop all running containers first
RUNNING_CONTAINERS=$(docker ps -q)
if [ -n "$RUNNING_CONTAINERS" ]; then
  echo "🛑 Stopping running containers..."
  docker stop $RUNNING_CONTAINERS
fi

# Remove all containers
echo "🗑️  Removing containers..."
docker rm $(docker ps -aq)

echo "✅ All Docker containers have been removed successfully!"
echo ""

# Show final status
REMAINING=$(docker ps -aq | wc -l)
echo "📊 Remaining containers: $REMAINING" 
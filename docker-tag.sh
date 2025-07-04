#!/bin/bash

# Docker image tagging script for natlife project
# Usage: ./docker-tag.sh [version]

set -e

# Get version from package.json if not provided
if [ $# -eq 0 ]; then
    VERSION=$(jq -r '.version' server/package.json)
    echo "Using version from package.json: $VERSION"
else
    VERSION=$1
    echo "Using provided version: $VERSION"
fi

# Configuration
REGISTRY="ghcr.io"
REPO_NAME="YOUR_USERNAME/natlife"  # Replace with your GitHub username/repo
IMAGE_NAME="$REGISTRY/$REPO_NAME"

echo "🐳 Building Docker image for natlife v$VERSION"
echo "Registry: $REGISTRY"
echo "Image: $IMAGE_NAME"

# Build the image
echo "Building image..."
docker build -t natlife:local .

# Test the image (optional)
echo "Testing image..."
docker run --rm natlife:local npm test

# Tag the image with multiple tags
echo "Tagging image..."
docker tag natlife:local "$IMAGE_NAME:v$VERSION"
docker tag natlife:local "$IMAGE_NAME:$VERSION"
docker tag natlife:local "$IMAGE_NAME:latest"

# Show created tags
echo "Created tags:"
docker images "$IMAGE_NAME" --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}"

# Push images (requires authentication)
echo ""
echo "To push images to registry:"
echo "1. Login: docker login $REGISTRY"
echo "2. Push version tag: docker push $IMAGE_NAME:v$VERSION"
echo "3. Push latest tag: docker push $IMAGE_NAME:latest"
echo ""
echo "Or push all tags: docker push $IMAGE_NAME --all-tags"

# Option to push automatically
read -p "Push images now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing images..."
    docker push "$IMAGE_NAME:v$VERSION"
    docker push "$IMAGE_NAME:$VERSION"
    docker push "$IMAGE_NAME:latest"
    echo "✅ Images pushed successfully!"
else
    echo "Skipping push. Use the commands above to push manually."
fi 
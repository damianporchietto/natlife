#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Export environment variables from .env file
export $(cat .env | grep -v '^#' | xargs)

# Build and start the containers
echo "Starting services..."
source .env
docker compose up --build --force-recreate
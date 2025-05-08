#!/bin/bash
set -e

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting NatLife build process with tests...${NC}"

# Navigate to server directory
cd server

# Install dependencies if needed
echo -e "${BLUE}Installing server dependencies...${NC}"
npm ci

# Run server tests
echo -e "${BLUE}Running server tests...${NC}"
npm test

# If tests passed, continue with frontend build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Server tests passed!${NC}"
  
  # Navigate to client directory
  cd ../client
  
  # Install dependencies if needed
  echo -e "${BLUE}Installing client dependencies...${NC}"
  npm ci
  
  # Build frontend
  echo -e "${BLUE}Building frontend...${NC}"
  npm run build
  
  echo -e "${GREEN}Build complete! You can now build the Docker image:${NC}"
  echo -e "${GREEN}docker-compose build${NC}"
  echo -e "${GREEN}docker-compose up${NC}"
  
  exit 0
else
  echo -e "${RED}Server tests failed! Fix the issues before building.${NC}"
  exit 1
fi 
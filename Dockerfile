# Test stage
FROM node:18-alpine AS test-stage
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --verbose
COPY server/ ./
RUN npm test --verbose -- --verbose

# Build stage for client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --verbose
COPY client/ ./
RUN npm run build --verbose
RUN ls -la dist/

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --verbose
COPY server/ ./

# Copy client build to the correct location
COPY --from=client-builder /app/client/dist ./client/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"] 
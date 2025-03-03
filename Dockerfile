# Build stage
FROM node:22 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
ARG CONFIGURATION=production
RUN npm run build -- --configuration ${CONFIGURATION}

# Production stage
FROM node:22-slim AS production

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from build stage
COPY --from=build /app/dist /app/dist

# Set node environment
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expose port 80
EXPOSE 80

# Set environment variable for port
ENV PORT=80

# Start the application
CMD ["node", "dist/order-management-ui/server/server.mjs"]
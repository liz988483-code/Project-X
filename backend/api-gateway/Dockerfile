FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies so TypeScript can compile
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S soko -u 1001

# Copy built files from builder stage
COPY --from=builder --chown=soko:nodejs /app/dist ./dist
COPY --from=builder --chown=soko:nodejs /app/package*.json ./
COPY --from=builder --chown=soko:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER soko

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 3001, path: '/health', timeout: 2000 }; const request = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); request.on('error', () => { process.exit(1); }); request.end();"

# Start the application
CMD ["node", "dist/index.js"]
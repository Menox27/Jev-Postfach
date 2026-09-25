FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy application code
COPY . .

# Build TypeScript if dist folder doesn't exist
RUN if [ ! -d "dist" ]; then npm run build; fi

# Remove dev dependencies for smaller production image
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]

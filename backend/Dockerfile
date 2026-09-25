FROM node:18-alpine

WORKDIR /app

# Copy package files and built dist folder
COPY package*.json ./
COPY dist/ ./dist/

# Install only production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]

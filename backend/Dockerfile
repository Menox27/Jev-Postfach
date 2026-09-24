# Dockerfile for Smart Email Labeling System
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (inklusive devDependencies wie typescript, um bauen zu können)
RUN npm install

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Prune devDependencies nach dem Build, um das Image klein zu halten
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
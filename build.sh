#!/bin/bash
# Build script for Smart Email Labeling System

echo "Building Smart Email Labeling System..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build TypeScript files
echo "Building TypeScript files..."
npm run build

echo "Build complete! The dist folder is ready for Docker deployment."

# Go back to root
cd ..

echo "To deploy with Docker:"
echo "  docker-compose up -d"


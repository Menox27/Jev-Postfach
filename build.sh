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

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! The dist folder is ready for Docker deployment."
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi

# Go back to root
cd ..

echo "To deploy with Docker:"
echo "  docker-compose up -d"


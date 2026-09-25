@echo off
REM Build script for Smart Email Labeling System

echo Building Smart Email Labeling System...

REM Navigate to backend directory
cd backend

REM Install dependencies
echo Installing dependencies...
npm install

REM Build TypeScript files
echo Building TypeScript files...
npm run build

echo Build complete! The dist folder is ready for Docker deployment.

REM Go back to root
cd ..

echo To deploy with Docker:
echo   docker-compose up -d


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

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo Build successful! The dist folder is ready for Docker deployment.
) else (
    echo Build failed! Please check the error messages above.
    exit /b 1
)

REM Go back to root
cd ..

echo To deploy with Docker:
echo   docker-compose up -d


@echo off
echo Starting Jharkhand Tourism Website...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if database exists, if not initialize it
if not exist "jharkhand_tourism.db" (
    echo Initializing database...
    node scripts/init-database.js
    if %errorlevel% neq 0 (
        echo Error: Failed to initialize database
        pause
        exit /b 1
    )
)

REM Start the server
echo Starting server on http://localhost:3000
echo.
echo Admin Credentials:
echo Email: admin@jharkhandtourism.com
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

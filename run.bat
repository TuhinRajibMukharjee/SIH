@echo off
title Jharkhand Tourism Server
color 0A
echo.
echo ========================================
echo    JHARKHAND TOURISM WEBSITE
echo ========================================
echo.
echo Starting server...
echo.

REM Kill any existing Node.js processes
taskkill /f /im node.exe >nul 2>&1

REM Start the server
node server.js

pause

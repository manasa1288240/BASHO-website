@echo off
REM Start BASHO Admin Backend
REM This batch file starts the backend server

echo.
echo ========================================
echo   BASHO Admin Backend Startup
echo ========================================
echo.

REM Navigate to backend directory
cd /d "%~dp0basho-backend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if jsonwebtoken is installed
npm list jsonwebtoken >nul 2>&1
if errorlevel 1 (
    echo Installing jsonwebtoken...
    call npm install jsonwebtoken
    echo.
)

REM Start the server
echo Starting server...
echo.
node server.js

pause

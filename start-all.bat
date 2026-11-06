@echo off
title Truck Wagon AI Platform - Launcher
echo ===================================================
echo   Starting Truck Wagon AI Detection Platform
echo   GPU Enabled: NVIDIA GeForce RTX 5050
echo ===================================================

echo Starting AI Engine (GPU)...
start "AI Engine - FastAPI (Port 8000)" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0scripts\start-ai.ps1"

echo Starting Backend API...
start "Backend - Node.js (Port 5000)" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0scripts\start-backend.ps1"

echo Starting Frontend UI...
start "Frontend - Next.js (Port 3000)" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0scripts\start-frontend.ps1"

echo.
echo All services launched!
echo Access the Frontend at: http://localhost:3000
echo Access the Backend at:  http://localhost:5000/api/health
echo Access the AI Engine at: http://localhost:8000/health
echo ===================================================
pause


$ErrorActionPreference = "Stop"
Set-Location -Path "$PSScriptRoot\..\backend"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting Backend API (Node.js Express) " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
node src/server.js

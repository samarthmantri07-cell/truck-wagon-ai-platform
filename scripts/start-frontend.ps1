$ErrorActionPreference = "Stop"
Set-Location -Path "$PSScriptRoot\..\frontend"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting Frontend UI (Next.js)         " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
npm run dev

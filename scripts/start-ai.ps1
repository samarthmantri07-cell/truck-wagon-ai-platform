$ErrorActionPreference = "Stop"
Set-Location -Path "$PSScriptRoot\..\ai-engine"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting AI Engine (FastAPI on GPU)    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
& ".\venv\Scripts\python.exe" -m uvicorn api.main:app --host 127.0.0.1 --port 8000

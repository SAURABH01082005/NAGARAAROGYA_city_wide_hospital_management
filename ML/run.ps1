$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python is not installed (or not on PATH)." -ForegroundColor Red
    Write-Host "Install Python 3.10+ from https://python.org and tick 'Add Python to PATH' on the first installer screen." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path ".venv")) {
    Write-Host "First-time setup: creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv .venv
}

. .\.venv\Scripts\Activate.ps1

Write-Host "Installing/updating dependencies (first run takes ~1 min)..." -ForegroundColor Cyan
pip install --quiet --disable-pip-version-check -r requirements.txt

Start-Job -ScriptBlock { Start-Sleep -Seconds 3; Start-Process "http://127.0.0.1:5000/" } | Out-Null

Write-Host ""
Write-Host "Starting Smart Hospital ML server. Press Ctrl+C to stop." -ForegroundColor Green
Write-Host "If the browser does not open automatically, go to http://127.0.0.1:5000/" -ForegroundColor Green
Write-Host ""

python server.py

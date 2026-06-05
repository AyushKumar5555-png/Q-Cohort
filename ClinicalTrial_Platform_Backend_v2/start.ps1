# ============================================================
#  start.ps1 - One-click launcher for the full-stack platform
#  Usage:  .\start.ps1
# ============================================================

$ROOT     = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND  = Join-Path $ROOT "clinical_platform"
$FRONTEND = Join-Path $ROOT "clinical-trial-optimizer"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  AI-Powered Clinical Trial Optimization Platform  " -ForegroundColor Cyan
Write-Host "  Team: The Collapse Architects | HACK4SOC 3.0    " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# -- Step 1: Check Python -------------------------------------------------------
Write-Host "[1/4] Checking Python..." -ForegroundColor Yellow
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "      ERROR: Python not found. Please install Python 3.10+." -ForegroundColor Red
    exit 1
}
Write-Host "      OK: $(python --version)" -ForegroundColor Green

# -- Step 2: Check Node / npm --------------------------------------------------
Write-Host "[2/4] Checking Node.js..." -ForegroundColor Yellow
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "      ERROR: Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}
Write-Host "      OK: $(node --version)" -ForegroundColor Green

# -- Step 3: Install backend deps if needed ------------------------------------
Write-Host "[3/4] Installing backend dependencies..." -ForegroundColor Yellow
$reqFile = Join-Path $BACKEND "requirements.txt"
python -m pip install -r $reqFile -q
Write-Host "      OK: Backend dependencies ready." -ForegroundColor Green

# -- Step 4: Install frontend deps if needed -----------------------------------
Write-Host "[4/4] Installing frontend dependencies..." -ForegroundColor Yellow
$nodeModules = Join-Path $FRONTEND "node_modules"
if (-not (Test-Path $nodeModules)) {
    Push-Location $FRONTEND
    npm install --silent
    Pop-Location
}
Write-Host "      OK: Frontend dependencies ready." -ForegroundColor Green

# -- Launch backend ------------------------------------------------------------
Write-Host ""
Write-Host ">> Starting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Magenta
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
} -ArgumentList $BACKEND

# Give the backend a moment to boot
Start-Sleep -Seconds 3

# -- Launch frontend -----------------------------------------------------------
Write-Host ">> Starting React frontend on http://localhost:3000 ..." -ForegroundColor Magenta
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $FRONTEND

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  Both services are starting up!" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "  Frontend  ->  http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend   ->  http://localhost:8000" -ForegroundColor Green
Write-Host "  API Docs  ->  http://localhost:8000/docs" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop both services." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Stream output from both jobs until Ctrl+C
try {
    while ($true) {
        Receive-Job $backendJob  | ForEach-Object { Write-Host "[BACKEND]  $_" -ForegroundColor DarkCyan }
        Receive-Job $frontendJob | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor DarkGreen }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job  $backendJob,  $frontendJob
    Remove-Job $backendJob, $frontendJob
    Write-Host "Done." -ForegroundColor Green
}

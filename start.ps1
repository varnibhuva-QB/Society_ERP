#!/usr/bin/env pwsh

# Society ERP - Automated Startup Script
# Usage: ./start.ps1

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Society ERP - Full Stack Startup                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommandPath
$projectRoot = Get-Item $scriptDir
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "Project Root: $projectRoot" -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -ErrorAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Kill existing node processes if requested
Write-Host "Checking for running Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found existing Node process(es). Stopping..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Stopped previous processes" -ForegroundColor Green
}
Write-Host ""

# Step 1: Setup Backend
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 1: Setting up Backend" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend folder not found at $backendPath" -ForegroundColor Red
    exit 1
}

Push-Location $backendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend npm install failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npm run seed 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database seeding skipped or completed" -ForegroundColor Yellow
}

Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Setup Frontend
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 2: Setting up Frontend" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend folder not found at $frontendPath" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Push-Location $frontendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    # Install lucide-react
    Write-Host "📦 Installing Lucide Icons..." -ForegroundColor Yellow
    npm install lucide-react
}

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

Pop-Location

# Step 3: Start Backend and Frontend
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 3: Starting Services" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Start Backend in background
Write-Host "🚀 Starting Backend on port 5000..." -ForegroundColor Green
Push-Location $backendPath

$backendProcess = Start-Process -FilePath "node" -ArgumentList "src/index.js" -PassThru -NoNewWindow
Write-Host "📍 Backend PID: $($backendProcess.Id)" -ForegroundColor Gray

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check if backend is running
if (Test-Port 5000) {
    Write-Host "✅ Backend started successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend may not be responding on port 5000" -ForegroundColor Yellow
}

Pop-Location
Write-Host ""

# Start Frontend
Write-Host "🚀 Starting Frontend on port 3000..." -ForegroundColor Green
Push-Location $frontendPath

$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -NoNewWindow
Write-Host "📍 Frontend PID: $($frontendProcess.Id)" -ForegroundColor Gray

Pop-Location
Write-Host ""

# Summary
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Demo Login:" -ForegroundColor Cyan
Write-Host "   Email:    admin@example.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📝 Alternative Demo:" -ForegroundColor Cyan
Write-Host "   Email:    member@example.com" -ForegroundColor White
Write-Host "   Password: member123" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Frontend will open automatically in your browser..." -ForegroundColor Yellow
Write-Host ""

# Wait for frontend to start
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Close this window to stop backend" -ForegroundColor Gray
Write-Host "   • Use Ctrl+C in frontend terminal to stop frontend" -ForegroundColor Gray
Write-Host "   • Backend logs are in this window" -ForegroundColor Gray
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green

# Keep backend running
Write-Host ""
Write-Host "Backend is running. Press Ctrl+C to stop..." -ForegroundColor Yellow

$backendProcess | Wait-Process

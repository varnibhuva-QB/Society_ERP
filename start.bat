@echo off
REM Society ERP - Windows Batch Startup Script
REM Usage: start.bat

REM Color codes for output
REM You may need to adjust based on your CMD settings

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Society ERP - Full Stack Startup                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Get current directory
for %%F in (.) do set PROJECT_ROOT=%%~dpF
set BACKEND_PATH=%PROJECT_ROOT%backend
set FRONTEND_PATH=%PROJECT_ROOT%frontend

echo Project Root: %PROJECT_ROOT%
echo Backend:  %BACKEND_PATH%
echo Frontend: %FRONTEND_PATH%
echo.

REM Stop any running Node processes
echo Checking for running Node processes...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Stopped previous Node processes
    timeout /t 2 /nobreak
) else (
    echo [INFO] No Node processes running
)
echo.

REM Step 1: Backend Setup
echo ═════════════════════════════════════════════════════════════
echo STEP 1: Setting up Backend
echo ═════════════════════════════════════════════════════════════
echo.

cd /d "%BACKEND_PATH%"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend folder not found at %BACKEND_PATH%
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [*] Installing Backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Backend npm install failed
        pause
        exit /b 1
    )
)

REM Generate Prisma client
echo [*] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma generate failed
    pause
    exit /b 1
)

REM Seed database (optional)
echo [*] Seeding database...
call npm run seed >nul 2>&1
echo [OK] Database setup complete
echo.

REM Step 2: Frontend Setup
echo ═════════════════════════════════════════════════════════════
echo STEP 2: Setting up Frontend
echo ═════════════════════════════════════════════════════════════
echo.

cd /d "%FRONTEND_PATH%"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend folder not found at %FRONTEND_PATH%
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [*] Installing Frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Frontend npm install failed
        pause
        exit /b 1
    )
    
    REM Install lucide-react
    echo [*] Installing Lucide Icons...
    call npm install lucide-react
)

echo [OK] Frontend setup complete
echo.

REM Step 3: Start Backend
echo ═════════════════════════════════════════════════════════════
echo STEP 3: Starting Services
echo ═════════════════════════════════════════════════════════════
echo.

cd /d "%BACKEND_PATH%"
echo [*] Starting Backend on port 5000...
start "Society ERP Backend" cmd /k "node src/index.js"
timeout /t 3 /nobreak
echo [OK] Backend started
echo.

REM Step 4: Start Frontend
cd /d "%FRONTEND_PATH%"
echo [*] Starting Frontend on port 3000...
start "Society ERP Frontend" cmd /k "npm start"
timeout /t 3 /nobreak
echo [OK] Frontend started
echo.

REM Summary
cls
echo.
echo ═════════════════════════════════════════════════════════════
echo [OK] STARTUP COMPLETE!
echo ═════════════════════════════════════════════════════════════
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Login:
echo   Email:    admin@example.com
echo   Password: admin123
echo.
echo Alternative Demo:
echo   Email:    member@example.com
echo   Password: member123
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak

REM Open browser
start http://localhost:3000

echo.
echo Browser opened. You can close this window.
echo The application will continue running in the other windows.
echo.
pause

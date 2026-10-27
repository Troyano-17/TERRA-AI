@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo  TERRA AI - DEMO EJECUTABLE (DATOS SIMULADOS)
echo ============================================
where node >nul 2>&1
if %errorlevel%==0 (
  start "" cmd /c "ping -n 3 127.0.0.1 >nul ^& start http://localhost:4173"
  node server.mjs
  goto end
)
where py >nul 2>&1
if %errorlevel%==0 (
  start "" cmd /c "ping -n 3 127.0.0.1 >nul ^& start http://localhost:4173"
  py -m http.server 4173
  goto end
)
echo Necesitas Node.js 18+ o Python 3 para iniciar el servidor local.
echo Descarga Node.js en https://nodejs.org/
pause
:end

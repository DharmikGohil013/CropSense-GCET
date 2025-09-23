@echo off
echo Starting Disease Prediction Application...
echo.

echo Starting API Server...
start "API Server" cmd /k "cd /d d:\Model\react-disease-app && python api_server.py"

echo Waiting for API server to start...
timeout /t 3 /nobreak >nul

echo Starting React Development Server...
start "React App" cmd /k "cd /d d:\Model\react-disease-app && npm run dev"

echo.
echo Both servers are starting...
echo API Server: http://127.0.0.1:7863
echo React App: http://localhost:5173
echo.
pause

@echo off
echo Starting Disease Prediction Application...
echo.

echo Starting Python API Server...
cd /d "d:\Model"
start "Python API" cmd /k ".\env\Scripts\activate && python api_server.py"

echo Waiting for API server to start...
timeout /t 5 /nobreak > nul

echo Starting React Development Server...
cd /d "d:\Model\react-disease-app"
start "React App" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Python API: http://127.0.0.1:8000
echo React App: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul

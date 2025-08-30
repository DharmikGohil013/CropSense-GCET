# PowerShell script to start both servers
Write-Host "Starting Disease Prediction Application..." -ForegroundColor Green
Write-Host ""

# Start Python API Server
Write-Host "Starting Python API Server..." -ForegroundColor Yellow
Set-Location "d:\Model"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '.\env\Scripts\activate.ps1'; python api_server.py"

# Wait a bit for the API server to start
Write-Host "Waiting for API server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start React Development Server
Write-Host "Starting React Development Server..." -ForegroundColor Yellow
Set-Location "d:\Model\react-disease-app"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Python API: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "React App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# CropSense API Server Network Setup Script
# Run this script as Administrator

Write-Host "🌾 CropSense Network Setup Starting..." -ForegroundColor Green

# Step 1: Get PC's IP Address
Write-Host "`n📡 Finding PC's IP Address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway -ne $null}).IPv4Address.IPAddress
Write-Host "PC IP Address: $ipAddress" -ForegroundColor Cyan

# Step 2: Open Firewall Port
Write-Host "`n🔥 Opening Firewall Port 8001..." -ForegroundColor Yellow
try {
    netsh advfirewall firewall add rule name="CropSense-API-8001" dir=in action=allow protocol=TCP localport=8001
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add firewall rule. Make sure you're running as Administrator." -ForegroundColor Red
}

# Step 3: Display Network Information
Write-Host "`n📋 Network Configuration:" -ForegroundColor Yellow
Write-Host "PC IP: $ipAddress" -ForegroundColor White
Write-Host "API Server: http://$ipAddress:8001" -ForegroundColor White
Write-Host "Frontend: http://10.10.5.33:5173" -ForegroundColor White
Write-Host "Local Test: http://127.0.0.1:8001" -ForegroundColor White

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: python api_server.py" -ForegroundColor White
Write-Host "2. Test locally: http://127.0.0.1:8001" -ForegroundColor White
Write-Host "3. Test from mobile: http://$ipAddress:8001" -ForegroundColor White
Write-Host "4. Update your React app to use: http://$ipAddress:8001" -ForegroundColor White

Write-Host "`n✨ Setup Complete! Press any key to continue..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

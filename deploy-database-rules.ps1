Write-Host "🔥 Deploying Firebase Database Rules..." -ForegroundColor Yellow

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
} catch {
    Write-Host "❌ Firebase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Cyan
    exit 1
}

# Check if user is logged in
try {
    firebase projects:list | Out-Null
} catch {
    Write-Host "❌ Not logged in to Firebase. Please login first:" -ForegroundColor Red
    Write-Host "firebase login" -ForegroundColor Cyan
    exit 1
}

# Deploy database rules
Write-Host "📋 Deploying database rules from src/database.rules.json..." -ForegroundColor Blue
firebase deploy --only database

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database rules deployed successfully!" -ForegroundColor Green
    Write-Host "🎯 Updated rules for:" -ForegroundColor Yellow
    Write-Host "   - Quiz results permissions" -ForegroundColor White
    Write-Host "   - Shared quiz permissions" -ForegroundColor White
    Write-Host "   - Better error handling" -ForegroundColor White
} else {
    Write-Host "❌ Failed to deploy database rules" -ForegroundColor Red
    exit 1
}
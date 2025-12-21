# Medium Export Script for Windows PowerShell
# Usage: .\scripts\export-to-medium.ps1

Write-Host "`n🚀 Exporting Hugo posts to Medium..." -ForegroundColor Cyan
Write-Host ""

# Create output directory
New-Item -ItemType Directory -Force -Path ".github\medium-html" | Out-Null

# Install dependencies if needed
if (-not (Test-Path ".github\scripts\node_modules")) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
    Push-Location .github\scripts
    npm install --silent
    Pop-Location
    Write-Host ""
}

# Export to Medium HTML
Write-Host "🔄 Converting posts to Medium HTML..." -ForegroundColor Yellow
Push-Location .github\scripts
npm run export
Pop-Location
Write-Host ""

# Display results
Write-Host "✅ Export complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Files saved to: .github\medium-html\" -ForegroundColor Cyan
Write-Host ""

Get-ChildItem .github\medium-html\*.html -ErrorAction SilentlyContinue | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 1)
    Write-Host "  ✓ $($_.Name) ($sizeKB KB)"
}

Write-Host ""
Write-Host "🌐 To preview: " -NoNewline
Write-Host "start .github\medium-html\welcome.html" -ForegroundColor White
Write-Host "📋 To use: Open HTML in browser, copy all content (Ctrl+A), paste into Medium" -ForegroundColor Gray
Write-Host ""

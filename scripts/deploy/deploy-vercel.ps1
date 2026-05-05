# Deploy to Vercel (Windows PowerShell)
Write-Host "🚀 Deploying frontend to Vercel..."

# Check if Vercel CLI is installed
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
  Write-Host "📦 Installing Vercel CLI..."
  npm install -g vercel
}

# Navigate to frontend
Set-Location frontend/web

# Deploy
Write-Host "📤 Uploading to Vercel..."
vercel --prod

Write-Host "✅ Vercel deployment complete!"
Write-Host "Your app is live at: https://soko-mauve.vercel.app"

Set-Location ../..

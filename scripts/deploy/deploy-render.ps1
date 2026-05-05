# Deploy to Render (Windows PowerShell)
Write-Host "🚀 Deploying backend to Render..."

# Check if git changes are committed
$status = git status --porcelain
if ($status) {
  Write-Host "❌ Error: Uncommitted changes detected"
  Write-Host "Please commit your changes first:"
  Write-Host "  git add -A"
  Write-Host "  git commit -m 'your message'"
  Write-Host "  git push origin main"
  exit 1
}

Write-Host "✅ Git is clean. Render will auto-deploy from GitHub."
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Go to https://dashboard.render.com"
Write-Host "2. Click 'New +' → 'Web Service'"
Write-Host "3. Connect GitHub repository"
Write-Host "4. Select this repo and branch: main"
Write-Host "5. Configure:"
Write-Host "   - Name: soko-api-gateway"
Write-Host "   - Environment: Docker"
Write-Host "   - Dockerfile Path: backend/api-gateway/Dockerfile"
Write-Host ""
Write-Host "Or use render.yaml for IaC deployment:"
Write-Host "  https://render.com/docs/infrastructure-as-code"

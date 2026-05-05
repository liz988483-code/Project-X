#!/bin/bash
# Deploy to Vercel using CLI

echo "🚀 Deploying frontend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Navigate to frontend
cd frontend/web

# Deploy
echo "Deploying Next.js app..."
vercel --prod

echo "✅ Vercel deployment complete!"
echo "Your app is live at: https://soko-mauve.vercel.app"

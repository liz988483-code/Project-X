#!/bin/bash
# Deploy to Render using CLI

echo "🚀 Deploying backend to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
  echo "Installing Render CLI..."
  npm install -g render
fi

# Deploy using render.yaml
echo "Deploying with render.yaml..."
render deploy

echo "✅ Render deployment initiated!"
echo "Check your deployment at: https://dashboard.render.com"

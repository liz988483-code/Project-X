#!/bin/bash

echo "🚀 Starting SOKO E-commerce Platform..."
echo "======================================"

echo "1. Checking PostgreSQL..."
docker-compose ps | grep postgres || echo "⚠️  PostgreSQL not running. Starting..."
docker-compose up -d postgres 2>/dev/null

echo "2. Starting Backend API..."
cd backend/api-gateway
node server.js &
BACKEND_PID=$!
cd ../..

echo "3. Starting Frontend..."
cd frontend/web
npm run dev &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api/health"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle exit
trap "echo 'Stopping services...'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit 0" INT TERM
wait

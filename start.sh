#!/bin/bash

echo "🚀 Starting SOKO E-commerce Platform..."
echo "======================================"

# Kill any existing processes
pkill -f "node server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Check PostgreSQL
echo "1. Checking PostgreSQL..."
if docker ps | grep -q postgres; then
    echo "✅ PostgreSQL is running"
else
    echo "🔄 Starting PostgreSQL..."
    docker-compose up -d postgres
    sleep 3
fi

# Start Backend
echo "2. Starting Backend API..."
cd backend/api-gateway
node server.js &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
sleep 2

# Start Frontend
echo "3. Starting Frontend..."
cd frontend/web
npm run dev &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Services started successfully!"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:3001/api/health"
echo "📦 Products:  http://localhost:3001/api/products"
echo "🐘 Database:  PostgreSQL on localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle exit
trap "echo 'Stopping services...'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit 0" INT TERM
wait

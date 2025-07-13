#!/bin/bash

# Resume Hosting Application Production Startup Script

echo "🚀 Starting Resume Hosting Application (Production Mode)..."
echo "=========================================================="

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Function to use docker-compose or docker compose
run_compose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

echo "✅ Docker is ready!"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
run_compose down

echo ""
echo "📦 Starting production containers..."
echo "   Using optimized production images..."

# Start production containers (no build flag since we're using pre-built images)
run_compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."

# Wait for MySQL to be ready
echo "   Waiting for MySQL..."
until docker exec resume_mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
    echo "   MySQL is starting up..."
    sleep 3
done

# Wait for backend to be ready
echo "   Waiting for Backend API..."
until curl -f http://localhost:5000/api/health &> /dev/null; do
    echo "   Backend is starting up..."
    sleep 3
done

# Wait for frontend to be ready
echo "   Waiting for Frontend..."
until curl -f http://localhost:3000 &> /dev/null; do
    echo "   Frontend is starting up..."
    sleep 3
done

echo ""
echo "🎉 Production Application is ready!"
echo "========================================"
echo "📱 Frontend:     http://localhost:3000"
echo "🔧 Backend API:  http://localhost:5000"
echo "🗄️  MySQL:       localhost:3306"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop application:"
echo "   docker-compose down"
echo ""
echo "🔄 Restart application:"
echo "   docker-compose restart"
echo ""

# Optional: Open browser
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening browser..."
    xdg-open http://localhost:3000
fi

echo "✨ Production setup complete! Your resume is now hosted and ready to view."

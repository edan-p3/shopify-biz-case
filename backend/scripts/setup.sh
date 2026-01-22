#!/bin/bash

echo "🚀 Setting up Shopify Business Case Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️  Please update the .env file with your database credentials"
    else
        echo "⚠️  .env.example not found. Please create .env manually"
    fi
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected. Would you like to start PostgreSQL and Redis with Docker? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🐳 Starting Docker containers..."
        docker-compose up -d postgres redis
        
        # Wait for services to be ready
        echo "⏳ Waiting for services to be ready..."
        sleep 5
    fi
else
    echo "⚠️  Docker not found. Please ensure PostgreSQL and Redis are running locally."
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The API will be available at http://localhost:3001"
echo "Health check: http://localhost:3001/api/health"
echo ""

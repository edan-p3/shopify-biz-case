#!/bin/bash
# Build script for Vercel

echo "Starting Vercel build..."

# Set a dummy DATABASE_URL if not present (Prisma generate doesn't need a real DB)
if [ -z "$DATABASE_URL" ]; then
  echo "Setting dummy DATABASE_URL for Prisma generation..."
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

# Install backend dependencies and generate Prisma client
echo "Installing backend dependencies..."
cd backend
npm install

echo "Generating Prisma Client..."
npx prisma generate

# Build frontend
echo "Installing frontend dependencies..."
cd ../app
npm install

echo "Building frontend..."
npm run build

echo "Build complete!"

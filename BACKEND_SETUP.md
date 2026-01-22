# Backend Setup Guide

This document provides step-by-step instructions to set up and run the Shopify Business Case backend.

## Quick Setup (Automated)

The easiest way to get started:

```bash
cd backend
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
1. Install all dependencies
2. Create `.env` file
3. Start Docker containers (if Docker is available)
4. Run database migrations
5. Seed the database with sample data

Then start the server:

```bash
npm run dev
```

## Manual Setup

If you prefer manual setup or the automated script doesn't work:

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/shopify_bizcase
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Start Database Services

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d postgres redis
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

#### Option B: Local Installation

Install PostgreSQL and Redis locally:

**macOS (using Homebrew):**
```bash
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis-server
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3001`

## Verify Installation

### 1. Check Health Endpoint

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "version": "1.0.0"
}
```

### 2. List Business Cases

```bash
curl http://localhost:3001/api/business-cases
```

You should see at least one sample business case created during seeding.

### 3. Get Sample Business Case

```bash
# Get the ID from the list response, then:
curl http://localhost:3001/api/business-cases/{id}
```

## Common Issues

### Port Already in Use

If port 3001 is already in use:

```bash
# Find the process
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change the port in .env
PORT=3002
```

### Database Connection Failed

1. Check if PostgreSQL is running:
   ```bash
   docker-compose ps
   # or
   pg_isready
   ```

2. Verify connection string in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/shopify_bizcase
   ```

3. Create database manually if needed:
   ```bash
   createdb shopify_bizcase
   ```

### Redis Connection Failed

1. Check if Redis is running:
   ```bash
   docker-compose ps
   # or
   redis-cli ping
   ```

2. Verify Redis URL in `.env`:
   ```
   REDIS_URL=redis://localhost:6379
   ```

### Prisma Migration Errors

If migrations fail:

```bash
# Reset database (WARNING: deletes all data)
npm run prisma:migrate:reset

# Or manually:
dropdb shopify_bizcase
createdb shopify_bizcase
npm run prisma:migrate
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tools

### Prisma Studio (Database GUI)

View and edit database contents:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### View Logs

Development logs are shown in the console. Production logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only

```bash
tail -f logs/combined.log
```

### Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

## Testing

### Run Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Manual API Testing

Use the provided examples in the README or use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

## Database Management

### View All Tables

```bash
npm run prisma:studio
```

### Create New Migration

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database

**WARNING:** This deletes all data!

```bash
npx prisma migrate reset
```

### Backup Database

```bash
pg_dump shopify_bizcase > backup.sql
```

### Restore Database

```bash
psql shopify_bizcase < backup.sql
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
JWT_SECRET=your-strong-secret-key
FRONTEND_URL=https://yourdomain.com
```

### Build and Run

```bash
# Build
npm run build

# Start
npm start
```

### Docker Deployment

```bash
# Build all services
docker-compose up -d

# View status
docker-compose ps

# Stop services
docker-compose down
```

## Next Steps

1. ✅ Backend is now running on `http://localhost:3001`
2. 🌐 Frontend should connect to this API
3. 📚 Read the API documentation in `backend/README.md`
4. 🧪 Run tests to ensure everything works
5. 🚀 Start building!

## Support

For issues:
1. Check the logs: `tail -f logs/combined.log`
2. Verify services: `docker-compose ps`
3. Test health endpoint: `curl http://localhost:3001/api/health`
4. Review common issues above
5. Check the main README.md for more details

Happy coding! 🚀

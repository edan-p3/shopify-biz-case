# Complete Backend Setup - Run These Commands

You've successfully installed PostgreSQL! Now run these commands in your terminal:

## Step 1: Start PostgreSQL

```bash
brew services start postgresql@15
```

## Step 2: Add PostgreSQL to your PATH

```bash
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

## Step 3: Create the database

```bash
createdb shopify_bizcase
```

## Step 4: Update the .env file

```bash
cd /Users/edandvora/Documents/shopify-biz-case/backend

# Create or update .env file
echo 'DATABASE_URL="postgresql://postgres@localhost:5432/shopify_bizcase"' > .env
echo 'JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"' >> .env
echo 'JWT_EXPIRES_IN="7d"' >> .env
echo 'NODE_ENV="development"' >> .env
echo 'PORT=3000' >> .env
echo 'FRONTEND_URL="http://localhost:3001"' >> .env
echo 'REDIS_URL="redis://localhost:6379"' >> .env
```

## Step 5: Run database migrations

```bash
cd /Users/edandvora/Documents/shopify-biz-case/backend
npx prisma migrate dev
```

## Step 6: (Optional) Seed the database with sample data

```bash
npm run prisma:seed
```

## Step 7: Start the backend server

```bash
npm run dev
```

## Step 8: Test the API

Open a new terminal and run:

```bash
curl http://localhost:3000/api/health
```

You should see a JSON response like:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-23T...",
  "services": {
    "database": "connected",
    "redis": "disconnected"
  },
  "version": "1.0.0"
}
```

## Troubleshooting

### If PostgreSQL won't start:
```bash
# Check if it's already running
brew services list

# Stop and restart
brew services stop postgresql@15
brew services start postgresql@15
```

### If database creation fails:
```bash
# Make sure PostgreSQL is in your PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Try creating the database again
createdb shopify_bizcase
```

### If migrations fail:
```bash
# Make sure you're in the backend directory
cd /Users/edandvora/Documents/shopify-biz-case/backend

# Check that .env file exists and has DATABASE_URL
cat .env

# Try migrations again
npx prisma migrate dev
```

## Success Indicators

✅ PostgreSQL service is running: `brew services list` shows postgresql@15 as "started"
✅ Database created: `psql -l` shows "shopify_bizcase" in the list
✅ Migrations applied: No errors when running `npx prisma migrate dev`
✅ Server started: You see "Server running on port 3000" in the console
✅ API responding: `curl http://localhost:3000/api/health` returns JSON

## What's Next?

Once your backend is running:
1. **Frontend Setup** - Set up the React frontend
2. **Test API Endpoints** - Use Postman or curl to test endpoints
3. **Start Development** - Begin building features!

## Quick Reference

- **Backend Directory**: `/Users/edandvora/Documents/shopify-biz-case/backend`
- **API Base URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`
- **Database**: `shopify_bizcase` on `localhost:5432`
- **Prisma Studio**: `npm run prisma:studio` (GUI for your database)

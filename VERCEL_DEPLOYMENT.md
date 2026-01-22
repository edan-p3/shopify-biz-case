# 🚀 Vercel Deployment Guide - All-in-One Platform

Your Shopify Business Case platform is now fully configured for **single-platform deployment on Vercel**!

## What's Changed

✅ **Backend refactored to Vercel Serverless Functions**
✅ **Optimized Prisma for serverless (connection pooling)**
✅ **Frontend stays the same (already Vercel-ready)**
✅ **All configuration files updated**

---

## Architecture

```
Frontend (React/Vite) → Vercel Static Site
Backend (API) → Vercel Serverless Functions
Database → Vercel Postgres
```

All on one platform! 🎉

---

## Quick Deploy (5 Minutes)

### Step 1: Push to GitHub

```bash
cd /Users/edandvora/Documents/shopify-biz-case

# Add the serverless changes
git add .
git commit -m "Refactor backend for Vercel serverless functions"

# Push (if you haven't already)
git remote add origin https://github.com/YOUR-USERNAME/shopify-biz-case.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in with GitHub**
3. **Click "Add New..."** → **"Project"**
4. **Import** your `shopify-biz-case` repository
5. **Configure**:
   - **Framework Preset**: Other (Vercel auto-detects)
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `app/dist`

### Step 3: Add Database (Vercel Postgres)

In your Vercel project dashboard:

1. Go to **"Storage"** tab
2. Click **"Create Database"** → **"Postgres"**
3. Follow prompts to create database
4. Vercel automatically adds `POSTGRES_URL` environment variable

### Step 4: Add Environment Variables

In Vercel project → **"Settings"** → **"Environment Variables"**:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | (auto-set by Vercel Postgres) | Already configured |
| `POSTGRES_PRISMA_URL` | (auto-set by Vercel Postgres) | For Prisma |
| `POSTGRES_URL_NON_POOLING` | (auto-set by Vercel Postgres) | For migrations |
| `JWT_SECRET` | Generate strong random string | Use password generator |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel domain |
| `NODE_ENV` | `production` | |

**To generate JWT_SECRET**, use:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Run Database Migration

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migration
vercel env pull .env.local
cd backend
npx prisma migrate deploy
npx prisma db seed
```

Or manually in Vercel Dashboard:
1. Go to **"Storage"** → Your Postgres database
2. Click **"Query"** tab
3. Run the migration SQL (generated from schema)

---

## API Routes (Serverless Functions)

Your API is now available at:

```
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/business-cases
https://your-app.vercel.app/api/business-cases/[id]
https://your-app.vercel.app/api/business-cases/[id]/scenarios/[type]
https://your-app.vercel.app/api/business-cases/[id]/risks
```

All endpoints are automatically deployed as serverless functions!

---

## Project Structure (Vercel)

```
shopify-biz-case/
├── api/                          # Vercel Serverless Functions
│   ├── health.ts                 # GET /api/health
│   └── business-cases/
│       ├── index.ts              # GET/POST /api/business-cases
│       ├── [id].ts               # GET/PUT/DELETE /api/business-cases/:id
│       └── [id]/
│           ├── scenarios/
│           │   └── [scenarioType].ts  # Scenario endpoints
│           └── risks/
│               └── index.ts      # Risk endpoints
├── app/                          # Frontend (Vite/React)
│   ├── src/
│   └── dist/ (built output)
├── backend/                      # Shared utilities
│   └── src/
│       ├── config/
│       ├── services/
│       └── utils/
├── package.json                  # Root config
└── vercel.json                   # Vercel configuration
```

---

## Configuration Files

### `vercel.json` - Vercel Configuration

Already configured! Routes API requests to serverless functions and frontend to static site.

### `package.json` - Build Scripts

```json
{
  "scripts": {
    "vercel-build": "cd app && npm install && npm run build"
  }
}
```

This tells Vercel how to build your frontend.

---

## Differences from Traditional Backend

### ✅ What Works

- All API endpoints
- Database queries (Prisma)
- Financial calculations
- Validation
- Error handling
- CORS configuration

### ⚠️ Limitations (Serverless)

- **No Redis/caching** (functions are stateless)
  - Solution: Use Vercel KV (optional upgrade)
- **No background jobs** (Bull/BullMQ)
  - Solution: Use Vercel Cron Jobs for scheduled tasks
- **No WebSockets** (stateless functions)
  - Not needed for this project
- **Function timeout**: 10 seconds (Hobby), 60 seconds (Pro)
  - Your calculations are fast enough

### What I Removed

- ❌ Redis caching (not needed for serverless)
- ❌ Express server (replaced with serverless functions)
- ❌ Background job queues (not needed for MVP)
- ❌ WebSocket support (not used)
- ❌ Session middleware (JWT works in serverless)

---

## Environment Variables Setup

### Development (Local)

Create `.env` in backend folder:

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/shopify_bizcase"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
```

### Production (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

```bash
DATABASE_URL="[auto-set by Vercel Postgres]"
POSTGRES_PRISMA_URL="[auto-set by Vercel Postgres]"
JWT_SECRET="[generate strong secret]"
FRONTEND_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

---

## Testing Your Deployment

### 1. Test Health Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-22T...",
  "services": {
    "database": "connected"
  }
}
```

### 2. Test Business Case Creation

```bash
curl -X POST https://your-app.vercel.app/api/business-cases \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Corp",
    "currentRevenue": 1500000,
    "currentPlatform": "Magento",
    "industry": "retail",
    "currentPlatformCost": 30000,
    "operationalCosts": {
      "revenueLeakage": 45000,
      "operationalInefficiency": 60000,
      "integrationMaintenance": 24000,
      "manualProcessing": 36000
    }
  }'
```

### 3. Test Frontend

Visit: `https://your-app.vercel.app`

You should see your business case dashboard!

---

## Troubleshooting

### "Build failed" Error

Check Vercel logs:
1. Go to **Deployments** tab
2. Click on failed deployment
3. View **Build Logs**

Common issues:
- Missing environment variables
- Build script errors
- Dependency issues

**Fix**: Update `vercel-build` script or check `app/package.json`

### "Function Invocation Failed"

Check Vercel function logs:
1. Go to **Deployments** → Click deployment
2. View **Function Logs**

Common issues:
- Database connection errors
- Missing environment variables
- Timeout (calculations too slow)

**Fix**: Check `DATABASE_URL` is set correctly

### "Database Connection Error"

1. Verify Vercel Postgres is created
2. Check environment variables are set
3. Run Prisma migrations:
   ```bash
   vercel env pull .env.local
   cd backend
   npx prisma migrate deploy
   ```

### CORS Errors

Update `FRONTEND_URL` environment variable in Vercel to match your deployment URL.

---

## Updating Your App

### Push Changes

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel **automatically deploys** every push! 🎉

### View Deployment

1. Go to Vercel dashboard
2. Click on **"Deployments"** tab
3. See build progress and logs

---

## Performance & Scaling

### Serverless Benefits

✅ **Auto-scaling**: Handles traffic spikes automatically
✅ **Pay-per-use**: Only pay for actual usage
✅ **Global CDN**: Fast worldwide
✅ **Zero maintenance**: No server management

### Optimization Tips

1. **Database Connection Pooling**: Already implemented ✅
2. **Prisma Client Caching**: Already optimized ✅
3. **API Response Caching**: Add if needed (Vercel Edge Config)
4. **Image Optimization**: Use Vercel Image Optimization

---

## Costs

### Vercel Pricing

**Hobby (Free Tier)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions (100 GB-hours)
- ✅ Vercel Postgres (256 MB storage)
- ✅ Perfect for testing & small projects

**Pro ($20/month)**:
- 1 TB bandwidth
- 1000 GB-hours functions
- 512 MB Postgres storage
- Custom domains
- Team collaboration

Your project should work fine on **Free tier** for development and small usage!

---

## Next Steps

1. ✅ **Push to GitHub** (if not done)
2. ✅ **Deploy to Vercel**
3. ✅ **Create Vercel Postgres**
4. ✅ **Set environment variables**
5. ✅ **Run migrations**
6. ✅ **Test your app**

---

## Comparison: Hybrid vs All-Vercel

| Feature | Hybrid (Railway) | All-Vercel (Serverless) |
|---------|------------------|-------------------------|
| **Deployment** | 2 platforms | 1 platform ✅ |
| **Cost** | Railway $5-10/mo | Vercel Free tier ✅ |
| **Setup Time** | 10 mins | 5 mins ✅ |
| **Scaling** | Manual | Auto ✅ |
| **Redis** | Full Redis | KV Store (optional) |
| **Background Jobs** | Bull/BullMQ | Cron Jobs |
| **Code Changes** | None | Refactored ✅ |

---

## Support

**Vercel Documentation**: https://vercel.com/docs
**Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
**Vercel Functions**: https://vercel.com/docs/functions

**Need Help?**
- Check Vercel logs in dashboard
- Review this guide
- Check Vercel documentation

---

🎉 **You're all set!** Your entire platform now runs on Vercel with serverless functions!

Deploy and enjoy! 🚀

# 🚀 Deployment Guide: GitHub + Vercel + Railway

This guide walks you through deploying your Shopify Business Case platform to production.

## 📋 Overview

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Railway (Node.js with PostgreSQL + Redis)
- **Source Control**: GitHub

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

Open Terminal and navigate to your project:

```bash
cd /Users/edandvora/Documents/shopify-biz-case
```

Initialize git:

```bash
git init
```

### Step 2: Stage All Files

```bash
git add .
```

### Step 3: Create First Commit

```bash
git commit -m "Initial commit: Shopify Business Case Platform

- Complete React frontend with interactive dashboard
- Node.js/Express backend with financial calculations
- PostgreSQL + Redis data layer
- Docker support
- Comprehensive API documentation"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** button (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `shopify-biz-case` (or your choice)
   - **Description**: "Business case analysis platform for Shopify commerce migrations"
   - **Visibility**: Choose Public or Private
   - ⚠️ **Important**: Do NOT check "Initialize with README" (we already have one)
4. Click **"Create repository"**

### Step 5: Connect Local Repo to GitHub

GitHub will show you commands. Use these (replace with YOUR details):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/edandvora/shopify-biz-case.git
git branch -M main
git push -u origin main
```

If prompted, enter your GitHub credentials or use a personal access token.

✅ **Your code is now on GitHub!**

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** (or "Log In" if you have an account)
3. Choose **"Continue with GitHub"** - this makes deployment easier

### Step 2: Import Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories listed
3. Find **`shopify-biz-case`** and click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect your framework. Configure:

- **Framework Preset**: Vite
- **Root Directory**: `app` ← **IMPORTANT!** Click "Edit" and set this
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)

### Step 4: Environment Variables (Optional for now)

If you want to connect to the backend later:

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | (leave blank for now, add after backend is deployed) |

### Step 5: Deploy!

Click **"Deploy"**

Vercel will:
- Install dependencies
- Build your React app
- Deploy to a URL like `https://shopify-biz-case-abc123.vercel.app`

⏱️ Takes 2-3 minutes

✅ **Your frontend is now live!**

### Step 6: Get Your URL

After deployment:
1. Click on your project
2. Copy the **Production URL** (e.g., `https://shopify-biz-case.vercel.app`)
3. Visit it in your browser!

---

## Part 3: Deploy Backend to Railway

Railway is perfect for Node.js apps with databases.

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click **"Login"**
3. Choose **"Login with GitHub"** - makes things easier
4. Authorize Railway to access your repositories

### Step 2: Create New Project

1. On Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`shopify-biz-case`** repository
4. Railway will ask what to deploy

### Step 3: Configure Service

In the configuration screen:

1. **Service Name**: `shopify-backend` (or your choice)
2. **Root Directory**: `backend` ← **IMPORTANT!**
3. **Build Command**: Leave as default (Railway auto-detects)
4. **Start Command**: Leave as default (uses package.json scripts)

Click **"Deploy"**

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates a database
3. Railway automatically sets the `DATABASE_URL` environment variable ✨

### Step 5: Add Redis

1. Click **"New"** → **"Database"** → **"Add Redis"**
2. Railway automatically creates Redis instance
3. Railway automatically sets the `REDIS_URL` environment variable ✨

### Step 6: Set Environment Variables

Click on your backend service, go to **"Variables"** tab:

Railway already set:
- ✅ `DATABASE_URL` (auto-set)
- ✅ `REDIS_URL` (auto-set)

Add these manually:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | Generate a strong secret (e.g., use a password generator) |
| `FRONTEND_URL` | Your Vercel URL from Part 2 (e.g., `https://shopify-biz-case.vercel.app`) |

Click **"Add"** after each one.

### Step 7: Generate Domain

1. Go to **"Settings"** tab in your backend service
2. Click **"Generate Domain"** under "Networking"
3. Railway gives you a URL like: `https://shopify-backend-production-abc123.railway.app`
4. **Copy this URL** - you'll need it!

### Step 8: Run Database Migrations

Railway doesn't automatically run Prisma migrations. You need to add a deploy command:

1. In Railway, go to your backend service
2. Go to **"Settings"** tab
3. Find **"Deploy"** section
4. Add a **"Build Command"**:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```

Or, you can manually run migrations once:

1. Click on your backend service
2. Go to the **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**
5. You should see the migration running

### Step 9: Seed Database (Optional)

To add sample data:

1. In Railway, click on your backend service
2. Go to **"Settings"** → **"Deploy"**
3. Add a one-time command or connect via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed
railway run npm run prisma:seed
```

✅ **Your backend is now live!**

---

## Part 4: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

1. Go back to **Vercel**
2. Click on your **`shopify-biz-case`** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add or update:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Railway backend URL (e.g., `https://shopify-backend-production.railway.app`) |

5. Click **"Save"**

### Step 2: Redeploy Frontend

1. In Vercel, go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Or, push any change to GitHub:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

Vercel auto-deploys on every push! 🎉

### Step 3: Update Backend CORS

The backend needs to allow requests from your Vercel URL:

1. In **Railway**, go to your backend service
2. Go to **"Variables"** tab
3. Update `FRONTEND_URL` to your Vercel URL
4. Railway auto-redeploys

---

## Part 5: Verify Everything Works

### Test Backend

Visit your Railway backend URL:
```
https://your-backend.railway.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "version": "1.0.0"
}
```

### Test Frontend

Visit your Vercel URL:
```
https://your-app.vercel.app
```

You should see your business case dashboard!

### Test Full Integration

1. Open your Vercel app
2. Try creating a business case
3. Check if data is saved
4. Try exporting a PDF

---

## 🎉 You're Live!

Your apps are now deployed:

- 🌐 **Frontend**: `https://your-app.vercel.app`
- 🔧 **Backend**: `https://your-backend.railway.app`
- 📦 **GitHub**: `https://github.com/YOUR-USERNAME/shopify-biz-case`

---

## 🔄 Making Updates

### Update Code

```bash
# Make your changes
git add .
git commit -m "Your change description"
git push
```

- **Vercel** auto-deploys frontend on every push ✨
- **Railway** auto-deploys backend on every push ✨

---

## 💰 Pricing

### Vercel
- **Free tier**: Includes everything you need
- Unlimited deployments
- Custom domains
- Analytics

### Railway
- **Free tier**: $5 credit/month (enough for hobby projects)
- Pay-as-you-go after that
- ~$5-10/month for small projects with PostgreSQL + Redis

### GitHub
- **Free**: Unlimited public and private repositories

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production` in Railway
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS (Railway/Vercel do this automatically)
- [ ] Set up proper CORS (already configured)
- [ ] Review rate limiting settings
- [ ] Set up monitoring/alerts in Railway

---

## 🐛 Troubleshooting

### "Build failed" on Vercel
- Check you set **Root Directory** to `app`
- Check build logs for errors
- Verify `package.json` has correct scripts

### "Application failed to respond" on Railway
- Check logs in Railway dashboard
- Verify environment variables are set
- Check DATABASE_URL is correct
- Verify migrations ran successfully

### CORS errors
- Update `FRONTEND_URL` in Railway to match your Vercel URL
- Check Railway logs for CORS errors
- Verify Vercel URL is correct (no trailing slash)

### Database connection errors
- Railway should auto-set `DATABASE_URL`
- Check Railway logs
- Verify PostgreSQL service is running

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [GitHub Documentation](https://docs.github.com)

---

## 🎯 Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to https://render.com
2. Create "New Web Service"
3. Connect GitHub repository
4. Root directory: `backend`
5. Build: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
6. Start: `npm start`
7. Add PostgreSQL database (Render dashboard)
8. Add Redis (Render dashboard or external provider)
9. Set environment variables

Render is slightly more manual but works similarly to Railway.

---

**Good luck with your deployment! 🚀**

If you encounter any issues, check the logs in Railway/Vercel dashboards.

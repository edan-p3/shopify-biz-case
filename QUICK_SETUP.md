# 🚀 Quick Database Setup Guide

Follow these steps in order to get your app working:

## ✅ Step 1: Add DATABASE_URL to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **shopify-biz-case** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgres://postgres.iqmkjqpwdmgcmxjjxqtl:aOU0vmOmzzaBREP6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - **Environments**: Check all boxes (Production, Preview, Development)
6. Click **Save**

## ✅ Step 2: Run Database Migration in Supabase

1. Open: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open this file in your code editor: `backend/prisma/migrations/20260124_init/migration.sql`
6. Copy ALL the contents (the entire file)
7. Paste into Supabase SQL Editor
8. Click **Run** (or press Cmd/Ctrl + Enter)
9. Wait for "Success" message

## ✅ Step 3: Mark Migration as Applied

Still in Supabase SQL Editor, run this second query:

```sql
-- Create the Prisma migrations table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Record the migration
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, applied_steps_count)
VALUES (
    gen_random_uuid()::text,
    'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    now(),
    '20260124_init',
    NULL,
    1
);
```

## ✅ Step 4: Redeploy on Vercel

After adding the DATABASE_URL environment variable:

1. Go back to Vercel dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click the **three dots** on the latest deployment
5. Click **Redeploy**
6. Wait for deployment to complete

## ✅ Step 5: Test Your API

Run these commands in your terminal:

```bash
# Test health endpoint
curl https://shopify-biz-case.vercel.app/api/health

# Expected: {"status":"healthy","timestamp":"...","services":{"database":"connected"},"version":"1.0.0"}

# Test business cases endpoint
curl https://shopify-biz-case.vercel.app/api/business-cases

# Expected: {"success":true,"data":[],"pagination":{...}}
```

## 🎉 Success Indicators

You'll know it's working when:
- Health endpoint returns: `"status":"healthy"` and `"database":"connected"`
- Business cases endpoint returns: `"success":true` with empty data array
- No error messages in Vercel function logs

## ⚠️ Troubleshooting

If you get errors:

1. **"Service unavailable"** - DATABASE_URL not set in Vercel or wrong value
2. **"Table does not exist"** - Migration not run in Supabase
3. **"Connection timeout"** - Check Supabase project isn't paused

Check Vercel function logs for detailed errors:
1. Go to Vercel → Your Project → Deployments
2. Click on latest deployment
3. Click **Functions** tab
4. View error logs

## 📋 Checklist

- [ ] DATABASE_URL added to Vercel
- [ ] Migration SQL executed in Supabase
- [ ] Prisma migrations table created
- [ ] Vercel redeployed
- [ ] Health endpoint returns "healthy"
- [ ] Business cases endpoint works

---

**Current Status**: Database schema created ✅ | Ready to connect to Vercel

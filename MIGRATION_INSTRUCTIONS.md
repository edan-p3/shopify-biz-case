# Database Migration Instructions

Due to connection limitations, follow these steps to set up your database:

## Step 1: Run the Main Migration

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `backend/prisma/migrations/20260124_init/migration.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute

**Note**: The migration file is located at: `backend/prisma/migrations/20260124_init/migration.sql`

## Step 2: Mark Migration as Applied

After running the migration SQL, run this SQL in Supabase to record it in Prisma's migration history:

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

## Step 3: Generate Prisma Client

After the migration is complete, generate the Prisma Client locally:

```bash
cd backend
npm run prisma:generate
```

## Step 4: (Optional) Run Seed Data

If you have a seed file, run:

```bash
npm run prisma:seed
```

## Connection Strings

For your application (use the **Transaction Pooler**):
```
DATABASE_URL="postgres://postgres.iqmkjqpwdmgcmxjjxqtl:aOU0vmOmzzaBREP6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

For migrations (use **Direct Connection** - but requires IPv6 or IPv4 add-on):
```
DATABASE_URL="postgresql://postgres:aOU0vmOmzzaBREP6@db.iqmkjqpwdmgcmxjjxqtl.supabase.co:5432/postgres"
```

## Troubleshooting

If you encounter issues:
- Make sure your Supabase project is not paused
- Check that your IP is not blocked
- Consider purchasing the IPv4 add-on if needed for direct connections

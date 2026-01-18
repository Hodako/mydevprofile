# Quick Start Guide

This guide will help you set up and deploy the Portfolio Backend in minutes.

## Step 1: Install Dependencies

```bash
cd worker-backend
npm install
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

## Step 3: Create D1 Database

### For Development:
```bash
npm run d1:create-dev
```

### For Production:
```bash
npm run d1:create
```

**Important:** Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Paste it here
```

## Step 4: Run Schema Migration

### Development:
```bash
npm run d1:migrate-dev
```

### Production:
```bash
npm run d1:migrate
```

## Step 5: Set Session Secret

Generate a secure secret:

```bash
# Generate secret
openssl rand -base64 32
```

Set it as an environment variable:

```bash
wrangler secret put SESSION_SECRET
```

When prompted, paste the generated secret.

## Step 6: Create Admin Account

After deploying, create your admin account:

```bash
curl -X POST https://your-worker-url/api/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

**⚠️ SECURITY NOTE:** After creating the admin account, remove or comment out the `/api/init-admin` endpoint in `src/index.ts` (around line 500).

## Step 7: Test Locally

```bash
npm run dev
```

The worker will run at: http://localhost:8787

Test the health check:
```bash
curl http://localhost:8787/
```

## Step 8: Deploy to Production

```bash
npm run deploy
```

Your worker will be deployed and you'll get a URL like:
`https://portfolio-backend.your-subdomain.workers.dev`

## Step 9: Update Frontend API URL

In your Next.js project, update the API configuration:

```typescript
// src/lib/api-config.ts
export const API_BASE_URL = 'https://your-worker-url.workers.dev'
```

## Common Issues & Solutions

### Issue: "Database binding not found"
**Solution:**
1. Verify `database_id` in `wrangler.toml` is correct
2. Ensure you ran the migration: `npm run d1:migrate`

### Issue: "SESSION_SECRET not found"
**Solution:**
```bash
wrangler secret put SESSION_SECRET
```

### Issue: CORS errors
**Solution:** The worker is configured to accept all origins (`*`). If you want to restrict it, update the CORS middleware in `src/index.ts` to your domain.

### Issue: "Admin already exists"
**Solution:** You can only create one admin per username. Either:
1. Use a different username
2. Delete the admin from D1 (requires direct database access)

## Environment Variables

| Variable | Description | Required |
|-----------|-------------|-----------|
| `SESSION_SECRET` | JWT signing secret for sessions | ✅ Yes |

## Database Management

### Query the database locally:
```bash
# Development
wrangler d1 execute portfolio-db-dev --command="SELECT * FROM Skill"

# Production
wrangler d1 execute portfolio-db --command="SELECT * FROM Skill"
```

### Export database:
```bash
wrangler d1 export portfolio-db --output=backup.json
```

### Import database:
```bash
wrangler d1 execute portfolio-db --file=backup.json
```

## Next Steps

1. ✅ Deploy the worker
2. ✅ Create admin account
3. ✅ Remove `/api/init-admin` endpoint
4. ✅ Update frontend API URL
5. ✅ Test login and admin dashboard
6. ✅ Update your skills, projects, and info

## Support

Need help? Check the full [README.md](./README.md) or contact:
- Email: azizulhakim886@outlook.com
- GitHub: https://github.com/hodako

Happy coding! 🚀

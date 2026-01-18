# 🚀 Deployment Guide - Cloudflare Worker with D1

This guide will walk you through deploying your portfolio backend to Cloudflare Workers.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Cloudflare account
- [ ] Logged in to Cloudflare (`wrangler login`)

## 📦 Step-by-Step Deployment

### Step 1: Navigate to Worker Backend

```bash
cd worker-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create D1 Database

#### For Production:

```bash
npm run d1:create
```

**Output Example:**
```
✅ Successfully created DB 'portfolio-db'

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### For Development (optional):

```bash
npm run d1:create-dev
```

### Step 4: Update wrangler.toml

1. Open `wrangler.toml`
2. Find `database_id = "YOUR_DATABASE_ID_HERE"`
3. Replace with your actual database ID from Step 3

**Before:**
```toml
database_id = "YOUR_DATABASE_ID_HERE"
```

**After:**
```toml
database_id = "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 5: Run Database Migration

#### Production:

```bash
npm run d1:migrate
```

**This creates all tables and indexes:**
- Admin
- Skill
- Project
- AboutInfo
- ContactInfo
- Message

#### Development (optional):

```bash
npm run d1:migrate-dev
```

### Step 6: Set Environment Variables

Generate a secure session secret:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid))
```

Set it as a secret:

```bash
wrangler secret put SESSION_SECRET
```

**Paste your generated secret when prompted.**

### Step 7: Test Locally (Optional)

```bash
npm run dev
```

The worker will run at: `http://localhost:8787`

Test the health check:
```bash
curl http://localhost:8787/
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Portfolio API is running"
}
```

### Step 8: Deploy to Cloudflare

```bash
npm run deploy
```

**Output Example:**
```
⛅️ wrangler 3.x.x
🌀 Building your worker...
✨ Built successfully, uploading...
📣 Published portfolio-backend
   https://portfolio-backend.YOUR_SUBDOMAIN.workers.dev
```

### Step 9: Create Admin Account

**IMPORTANT:** Only do this once! After creating admin, remove the endpoint.

```bash
curl -X POST https://your-worker-url.workers.dev/api/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin account created"
}
```

### Step 10: Remove Init Admin Endpoint (SECURITY!)

After creating admin account, **REMOVE** this section from `src/index.ts`:

```typescript
// DELETE or COMMENT OUT THIS ENTIRE SECTION
// ==================== INIT ADMIN ====================

// Initialize admin account (run once)
app.post('/api/init-admin', async (c) => {
  // ... entire endpoint
})

// ===============================================
```

Then redeploy:
```bash
npm run deploy
```

### Step 11: Update Frontend Configuration

Update your Next.js frontend to use the new worker URL:

**File:** `/home/z/my-project/src/lib/api-config.ts`

```typescript
export const API_BASE_URL = 'https://portfolio-backend.YOUR_SUBDOMAIN.workers.dev'
```

### Step 12: Test the Complete System

1. **Test Admin Login:**
   ```bash
   curl -X POST https://your-worker-url.workers.dev/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-password"}' \
     -c cookies.txt
   ```

2. **Test API Endpoints:**
   ```bash
   # Get skills
   curl -b cookies.txt https://your-worker-url.workers.dev/api/skills
   
   # Create skill
   curl -X POST https://your-worker-url.workers.dev/api/skills \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{
       "name":"TypeScript",
       "description":"Type-safe JavaScript",
       "iconUrl":"https://example.com/icon.svg",
       "type":"image",
       "color":"from-blue-500 to-blue-700",
       "category":"Frontend"
     }'
   ```

3. **Test Frontend:**
   - Visit your frontend at `http://localhost:3000`
   - Navigate to `/whoisadmin/login`
   - Login with your admin credentials
   - Test adding skills, projects, etc.

## 🌐 Custom Domain Setup (Optional)

### With Cloudflare:

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. Click "Settings" → "Triggers" → "Custom Domains"
5. Add your custom domain: `api.yourdomain.com`

### Update CORS in Worker:

Edit `src/index.ts` CORS middleware:

```typescript
app.use('*', cors({
  origin: 'https://yourdomain.com', // Change from '*'
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
```

Then redeploy:
```bash
npm run deploy
```

## 🗄️ Database Management

### Query Database:

```bash
# Production
wrangler d1 execute portfolio-db --command="SELECT * FROM Skill"

# Development
wrangler d1 execute portfolio-db-dev --command="SELECT * FROM Skill"
```

### Create Backup:

```bash
wrangler d1 export portfolio-db --output=backup-$(date +%Y%m%d).json
```

### Import from Backup:

```bash
wrangler d1 execute portfolio-db --file=backup-20250118.json
```

### Reset Database (DANGER):

```bash
# Delete all tables
wrangler d1 execute portfolio-db --command="DROP TABLE IF EXISTS Admin; DROP TABLE IF EXISTS Skill; DROP TABLE IF EXISTS Project; DROP TABLE IF EXISTS AboutInfo; DROP TABLE IF EXISTS ContactInfo; DROP TABLE IF EXISTS Message;"

# Re-run migration
npm run d1:migrate
```

## 🔒 Security Best Practices

### ✅ Before Production:

1. **Strong Session Secret:**
   ```bash
   openssl rand -base64 64  # Use 64 characters
   ```

2. **Remove Init Endpoint:**
   - Delete `/api/init-admin` from `src/index.ts`
   - Only one admin account per username

3. **Restrict CORS Origin:**
   ```typescript
   origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
   ```

4. **Enable Rate Limiting (Future):**
   - Add Cloudflare rate limiting rules
   - Use Workers KV for request tracking

5. **Monitor Logs:**
   ```bash
   wrangler tail
   ```

### ✅ Regular Maintenance:

1. **Rotate Session Secret:**
   ```bash
   wrangler secret put SESSION_SECRET
   ```

2. **Review Messages:**
   - Regularly delete old messages
   - Mark important messages as read

3. **Backup Database:**
   - Daily or weekly backups
   - Store in version control or secure storage

## 🐛 Troubleshooting

### Issue: "Database binding not found"

**Cause:** `database_id` in wrangler.toml is incorrect

**Solution:**
```bash
# List your databases
wrangler d1 list

# Update wrangler.toml with correct ID
```

### Issue: "SESSION_SECRET not found"

**Cause:** Environment variable not set

**Solution:**
```bash
# Check secrets
wrangler secret list

# Set missing secret
wrangler secret put SESSION_SECRET
```

### Issue: "Module not found: hono/jwt"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "TypeScript compilation error"

**Cause:** Missing or incorrect tsconfig.json

**Solution:**
```bash
# Verify tsconfig.json exists
cat tsconfig.json

# Reinstall types
npm install --save-dev @cloudflare/workers-types
```

### Issue: CORS errors in browser

**Cause:** Origin not allowed or credentials not sent

**Solution:**
1. Check CORS configuration in `src/index.ts`
2. Ensure frontend sends `credentials: 'include'`
3. Verify API URL is correct

### Issue: "Admin already exists"

**Cause:** Trying to create admin with same username

**Solution:**
- Use different username
- Or delete from database manually:
  ```bash
  wrangler d1 execute portfolio-db --command="DELETE FROM Admin WHERE username='admin'"
  ```

## 📊 Monitoring & Logs

### View Real-time Logs:

```bash
wrangler tail
```

### View Logs for Specific Worker:

```bash
wrangler tail portfolio-backend
```

### Filter Logs:

```bash
wrangler tail --format=pretty | grep "ERROR"
```

## 🚀 Production Deployment Checklist

- [ ] Database created and migrated
- [ ] SESSION_SECRET set
- [ ] Admin account created
- [ ] `/api/init-admin` endpoint removed
- [ ] CORS origin restricted (optional but recommended)
- [ ] Custom domain configured (optional)
- [ ] Frontend API URL updated
- [ ] Tested all API endpoints
- [ ] Verified admin login
- [ ] Tested CRUD operations
- [ ] Database backup created

## 📞 Support & Resources

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **D1 Database Docs:** https://developers.cloudflare.com/d1/
- **Hono Framework:** https://hono.dev/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/

For portfolio-specific support:
- 📧 Email: azizulhakim886@outlook.com
- 🐙 GitHub: https://github.com/hodako

## 🎉 You're Live!

Your portfolio backend is now running on Cloudflare's global network!

**Typical Response Times:**
- 🌍 Global: 10-50ms
- 🏙 Local: 5-20ms

**Database Performance:**
- 📖 Read operations: <10ms
- ✍️ Write operations: <20ms

Enjoy your high-performance portfolio backend! 🚀

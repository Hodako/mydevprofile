# Portfolio Backend - Cloudflare Worker with D1

A high-performance backend API for Azizul Hakim's portfolio, built with Cloudflare Workers and D1 SQLite database.

## 🚀 Features

- ✅ **Cloudflare Workers** - Edge computing for global performance
- ✅ **D1 SQLite** - Serverless SQLite database
- ✅ **Hono Framework** - Fast and lightweight web framework
- ✅ **Authentication** - JWT-based session management
- ✅ **CORS Support** - Ready for cross-origin requests
- ✅ **Full CRUD** - Complete API for skills, projects, messages, etc.

## 📋 Prerequisites

- Node.js 18+ installed
- Wrangler CLI installed globally
- Cloudflare account with Workers and D1 enabled

## 🛠️ Installation

1. **Install Wrangler CLI** (if not already installed):
```bash
npm install -g wrangler
```

2. **Login to Cloudflare**:
```bash
wrangler login
```

3. **Install dependencies**:
```bash
cd worker-backend
npm install
```

## 🗄️ Setting up D1 Database

### 1. Create D1 Database

**Production:**
```bash
npm run d1:create
```

**Development:**
```bash
npm run d1:create-dev
```

### 2. Update wrangler.toml

After creating the databases, copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Update this
```

### 3. Run Schema Migration

**Production:**
```bash
npm run d1:migrate
```

**Development:**
```bash
npm run d1:migrate-dev
```

## 🔑 Setting Environment Variables

### 1. Set SESSION_SECRET

Generate a secure session secret and set it:

```bash
wrangler secret put SESSION_SECRET
```

When prompted, enter a secure random string (e.g., use: `openssl rand -base64 32`).

## 👤 Create Admin Account

After setting up the database and secrets, create the initial admin account:

```bash
curl -X POST https://your-worker-url/api/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

**⚠️ Important:** Delete this endpoint or comment it out after creating the admin account!

## 🧪 Local Development

Run the worker in development mode:

```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

## 🚀 Deployment

### Deploy to Production

```bash
npm run deploy
```

### Deploy to Development

```bash
wrangler deploy --env dev
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/check` | Check authentication |
| POST | `/api/auth/logout` | Logout |

### Skills

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/skills` | Get all skills |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |

### Projects

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### About Info

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/about` | Get all about info |
| PUT | `/api/about` | Update about info |

### Contact Info

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/contact-info` | Get all contact info |
| PUT | `/api/contact-info` | Update contact info |

### Messages

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/messages` | Get all messages |
| POST | `/api/messages` | Create message |
| PUT | `/api/messages/:id` | Mark as read/unread |
| DELETE | `/api/messages/:id` | Delete message |

### Admin Initialization

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/init-admin` | Create initial admin account |

## 🔒 Security Best Practices

1. **Strong Session Secret**: Use a cryptographically secure secret for JWT signing
2. **Delete Init Endpoint**: Remove `/api/init-admin` after creating admin
3. **HTTPS Only**: Always use HTTPS in production
4. **Secure Cookies**: Cookies are set with `httpOnly`, `secure`, and `sameSite`
5. **Password Hashing**: All passwords are hashed with bcrypt

## 📝 Example Requests

### Login
```bash
curl -X POST https://your-worker-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }' \
  -c cookies.txt
```

### Create Skill
```bash
curl -X POST https://your-worker-url/api/skills \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "TypeScript",
    "description": "Type-safe JavaScript",
    "iconUrl": "https://example.com/icon.svg",
    "type": "image",
    "color": "from-blue-500 to-blue-700",
    "category": "Frontend"
  }'
```

### Get Messages
```bash
curl https://your-worker-url/api/messages \
  -b cookies.txt
```

## 🌐 CORS Configuration

The API is configured to accept requests from any origin with credentials enabled. To restrict to specific domains, update the CORS middleware in `src/index.ts`:

```typescript
app.use('*', cors({
  origin: 'https://your-domain.com', // Change this
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
```

## 📊 Database Schema

The database includes the following tables:

- **Admin** - Admin user accounts
- **Skill** - Skills with categories
- **Project** - Portfolio projects
- **AboutInfo** - About page content (key-value pairs)
- **ContactInfo** - Contact information (key-value pairs)
- **Message** - Contact form submissions

See `schema.sql` for the complete schema definition.

## 🐛 Troubleshooting

### Database Not Found
If you get a database binding error, ensure:
1. You created the D1 database
2. Updated the `database_id` in `wrangler.toml`
3. Ran the schema migration

### Session Secret Not Set
If authentication fails:
```bash
wrangler secret list  # Check if SESSION_SECRET exists
wrangler secret put SESSION_SECRET  # Set it if missing
```

### CORS Issues
- Ensure the frontend URL is added to CORS origin
- Check that credentials are being sent with requests
- Verify the API URL is correct

## 📞 Support

For issues or questions, contact:
- Email: azizulhakim886@outlook.com
- GitHub: https://github.com/hodako

## 📄 License

MIT License - feel free to use for your own projects!

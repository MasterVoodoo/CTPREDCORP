# Plesk Deployment - Step by Step Guide

## Current Issue
- Application Root: `/httpdocs/backend` ❌
- Document Root: `/httpdocs` ✅
- This mismatch causes Passenger to fail

## Solution: Correct Configuration

### Step 1: Prepare Files Locally

1. **Build the frontend:**
```bash
npm run build
```

2. **Create root package.json** (in project root, same level as dist/):

Create `package.json`:
```json
{
  "name": "ctpredcorp",
  "version": "1.0.0",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

3. **Update .htaccess** (in project root):

Create/update `.htaccess`:
```apache
# Passenger Configuration
PassengerEnabled on
PassengerAppRoot /var/www/vhosts/ctpred.com.ph/httpdocs
PassengerStartupFile backend/server.js
PassengerAppType node

# API Routing
RewriteEngine On

# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# API requests - let Passenger handle them
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# All other requests serve React app
RewriteRule ^ /index.html [L]
```

### Step 2: Upload to Plesk

**Upload these files to `/httpdocs/`:**

```
httpdocs/
├── package.json          (NEW - root package.json)
├── index.html           (from dist/)
├── assets/              (from dist/assets/)
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── scripts/
└── .htaccess            (updated)
```

### Step 3: Configure Plesk Node.js

Go to **Plesk → Domains → ctpred.com.ph → Node.js**

**Set these values EXACTLY:**

| Setting | Value |
|---------|-------|
| Node.js Version | 20.20.1 |
| Package Manager | npm |
| **Document Root** | `/httpdocs` |
| Application Mode | production |
| **Application URL** | (leave EMPTY) |
| **Application Root** | `/httpdocs` ⚠️ NOT /httpdocs/backend |
| **Application Startup File** | `backend/server.js` ⚠️ NOT just server.js |

### Step 4: Environment Variables

**IMPORTANT: Change NODE_ENV to production**

```
NODE_ENV=production                    ⚠️ Change from "development"
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph    ⚠️ Add this
PORT=5000
DB_HOST=localhost
DB_USER=ctpredcorp
DB_PASSWORD=ctpredcorp_2026
DB_NAME=ctpredcorp_db
DB_PORT=3306
JWT_SECRET=da31d0c021d803b898141e3ac1f13667e65081fcc7fff59be1657683755118c6
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=thegodlykali@gmail.com
SMTP_PASSWORD=yczntutjpwaursbr
SMTP_FROM_EMAIL=noreply@ctpred.com.ph
COMPANY_EMAIL=aseantower@ctpred.com.ph
BCRYPT_ROUNDS=10
ADMIN_SESSION_TIMEOUT=3600000
```

### Step 5: Install Dependencies

In Plesk Node.js settings:

1. Click **"NPM Install"** button
2. Wait for it to complete
3. Check the logs for any errors

### Step 6: Enable and Restart

1. Make sure **"Enable Node.js"** is checked
2. Click **"Restart App"** button
3. Wait 10-15 seconds

### Step 7: Test

**Test API directly:**

```bash
# SSH into server
ssh your-user@ctpred.com.ph

# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"CTP RED API is running",...}
```

**Test from browser:**
- Visit: `https://ctpred.com.ph/api/health`
- Should see JSON response

**Test website:**
- Visit: `https://ctpred.com.ph`
- Should load without errors
- Check browser console - no 500 errors

### Step 8: If Still Not Working

#### Option A: Check Passenger Logs

```bash
# SSH into server
tail -f /var/log/passenger.log
```

Look for errors related to your app.

#### Option B: Use PM2 Instead (Recommended)

If Passenger still doesn't work, use PM2:

```bash
# SSH into server
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend

# Install dependencies
npm install --production

# Install PM2
npm install -g pm2

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=ctpredcorp
DB_PASSWORD=ctpredcorp_2026
DB_NAME=ctpredcorp_db
DB_PORT=3306
JWT_SECRET=da31d0c021d803b898141e3ac1f13667e65081fcc7fff59be1657683755118c6
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=thegodlykali@gmail.com
SMTP_PASSWORD=yczntutjpwaursbr
SMTP_FROM_EMAIL=noreply@ctpred.com.ph
COMPANY_EMAIL=aseantower@ctpred.com.ph
BCRYPT_ROUNDS=10
ADMIN_SESSION_TIMEOUT=3600000
EOF

# Start with PM2
pm2 start server.js --name ctpredcorp-api
pm2 save
pm2 startup

# Test
curl http://localhost:5000/api/health
```

Then **disable Node.js in Plesk** and update `.htaccess`:

```apache
RewriteEngine On

# API proxy to PM2 backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### Troubleshooting

#### Error: "Cannot find module"
```bash
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend
npm install --production
```

#### Error: "Database connection failed"
```bash
# Test database connection
mysql -u ctpredcorp -p ctpredcorp_db
# Enter password: ctpredcorp_2026
```

#### Error: "Port already in use"
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

#### Check if backend is running
```bash
# Check process
ps aux | grep node

# Check port
netstat -tulpn | grep 5000
```

### Final Checklist

- [ ] Root `package.json` exists in `/httpdocs/`
- [ ] `.htaccess` updated in `/httpdocs/`
- [ ] Application Root set to `/httpdocs` (not `/httpdocs/backend`)
- [ ] Application Startup File set to `backend/server.js`
- [ ] NODE_ENV set to `production` (not `development`)
- [ ] FRONTEND_URL added to environment variables
- [ ] NPM Install completed successfully
- [ ] Node.js enabled in Plesk
- [ ] App restarted in Plesk
- [ ] `/api/health` returns 200 OK
- [ ] Website loads without 500 errors

## Summary

The key changes:
1. **Application Root**: `/httpdocs` (not `/httpdocs/backend`)
2. **Application Startup File**: `backend/server.js` (not `server.js`)
3. **NODE_ENV**: `production` (not `development`)
4. **Root package.json**: Must exist in `/httpdocs/`
5. **Updated .htaccess**: Proper routing for Passenger

This configuration tells Passenger:
- "Your app root is `/httpdocs`"
- "Start the app by running `backend/server.js`"
- "Run in production mode"
- "Route API requests to the Node.js app"

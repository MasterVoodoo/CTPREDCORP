# Plesk Deployment Guide - Fix Backend 500 Error

## Problem
Backend API returns 500 error: "Web application could not be started by Phusion Passenger"

## Root Cause
Phusion Passenger (Node.js server in Plesk) cannot start the backend application.

## Solution

### 1. File Structure for Plesk

Your deployment should look like this:
```
httpdocs/
├── index.html (from dist/)
├── assets/ (from dist/assets/)
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── routes/
│   └── ...
├── package.json (ROOT - for Passenger)
└── .htaccess
```

### 2. Create Root package.json

Create `package.json` in the **root directory** (same level as index.html):

```json
{
  "name": "ctpredcorp-production",
  "version": "1.0.0",
  "description": "CTP RED CORP Website",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.3",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.6.5",
    "nodemailer": "^6.10.1"
  }
}
```

### 3. Configure Plesk Node.js Settings

1. **Login to Plesk**
2. Go to **Domains** → **ctpred.com.ph**
3. Click **Node.js**
4. Set these values:

```
✅ Node.js: Enabled
✅ Node.js Version: 18.x (or latest LTS)
✅ Application Mode: production
✅ Application Root: /httpdocs
✅ Application Startup File: backend/server.js
✅ Application URL: (leave empty or /)
```

5. Click **Enable Node.js** and **NPM Install**

### 4. Environment Variables in Plesk

In Plesk Node.js settings, add these **Custom Environment Variables**:

```
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ctpredcorp
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
```

### 5. Update .htaccess for API Routing

Create/update `.htaccess` in root:

```apache
# Passenger configuration
PassengerEnabled on
PassengerAppRoot /var/www/vhosts/ctpred.com.ph/httpdocs
PassengerStartupFile backend/server.js
PassengerAppType node
PassengerNodejs /opt/plesk/node/18/bin/node

# API routing - proxy to Node.js
RewriteEngine On

# API requests go to Node.js backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://localhost:5000/$1 [P,L]

# All other requests serve React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 6. Alternative: Separate Backend Port

If Passenger doesn't work, run backend on separate port:

**Option A: Use PM2 (Recommended)**

1. SSH into server
2. Install PM2:
```bash
npm install -g pm2
```

3. Create `ecosystem.config.js` in backend folder:
```javascript
module.exports = {
  apps: [{
    name: 'ctpredcorp-api',
    script: './server.js',
    cwd: '/var/www/vhosts/ctpred.com.ph/httpdocs/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DB_HOST: 'localhost',
      DB_USER: 'your_db_user',
      DB_PASSWORD: 'your_db_password',
      DB_NAME: 'ctpredcorp',
      JWT_SECRET: 'your-secret-key'
    }
  }]
};
```

4. Start backend:
```bash
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. Update `.htaccess` to proxy to port 5000:
```apache
RewriteEngine On

# API proxy to backend on port 5000
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# React app routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### 7. Check Logs

**Passenger Logs:**
```bash
tail -f /var/log/passenger.log
```

**Node.js App Logs (if using PM2):**
```bash
pm2 logs ctpredcorp-api
```

**Apache Error Logs:**
```bash
tail -f /var/www/vhosts/ctpred.com.ph/logs/error_log
```

### 8. Test Backend

Once configured, test:

```bash
# Test health endpoint
curl https://ctpred.com.ph/api/health

# Test buildings endpoint
curl https://ctpred.com.ph/api/buildings

# Expected response:
# {"status":"OK","message":"CTP RED API is running",...}
```

### 9. Common Issues & Fixes

#### Issue: "Cannot find module"
**Fix:** Run `npm install` in backend folder
```bash
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend
npm install --production
```

#### Issue: Database connection failed
**Fix:** Check database credentials in environment variables
```bash
# Test database connection
mysql -u your_db_user -p ctpredcorp
```

#### Issue: Port already in use
**Fix:** Kill process on port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

#### Issue: Permission denied
**Fix:** Set correct permissions
```bash
chown -R www-data:www-data /var/www/vhosts/ctpred.com.ph/httpdocs
chmod -R 755 /var/www/vhosts/ctpred.com.ph/httpdocs
```

### 10. Verification Checklist

- [ ] Root `package.json` exists
- [ ] Backend `package.json` has all dependencies
- [ ] `npm install` completed successfully
- [ ] Environment variables set in Plesk
- [ ] Node.js enabled in Plesk
- [ ] `.htaccess` configured for API routing
- [ ] Database accessible from server
- [ ] `/api/health` returns 200 OK
- [ ] `/api/buildings` returns data
- [ ] Website loads without errors

### 11. Quick Fix Commands

Run these in SSH:

```bash
# Navigate to site root
cd /var/www/vhosts/ctpred.com.ph/httpdocs

# Install dependencies
cd backend && npm install --production && cd ..

# Restart Passenger
touch tmp/restart.txt

# Or restart Apache
systemctl restart apache2

# Check if backend is running
curl http://localhost:5000/api/health
```

### 12. Recommended: Use PM2 Instead of Passenger

Passenger can be tricky with Node.js. PM2 is more reliable:

```bash
# Install PM2
npm install -g pm2

# Start backend
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend
pm2 start server.js --name ctpredcorp-api

# Save and auto-start on reboot
pm2 save
pm2 startup

# Monitor
pm2 monit
```

## Summary

The issue is that Passenger cannot start your Node.js backend. The solution is to either:

1. **Configure Passenger properly** (complex, not recommended)
2. **Use PM2** (recommended, more reliable)

PM2 will run your backend on port 5000, and Apache will proxy `/api/*` requests to it.

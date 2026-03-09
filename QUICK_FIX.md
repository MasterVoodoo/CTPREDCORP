# Quick Fix for Plesk Deployment Error

## Problem
Backend returns 500 error - Passenger cannot start Node.js app

## Quick Solution (5 minutes)

### Step 1: SSH into Your Server
```bash
ssh your-username@ctpred.com.ph
```

### Step 2: Navigate to Your Site
```bash
cd /var/www/vhosts/ctpred.com.ph/httpdocs
```

### Step 3: Install Dependencies
```bash
cd backend
npm install --production
cd ..
```

### Step 4: Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### Step 5: Start Backend with PM2
```bash
cd backend
pm2 start server.js --name ctpredcorp-api
pm2 save
pm2 startup
```

### Step 6: Update .htaccess
Create/edit `.htaccess` in root (`/var/www/vhosts/ctpred.com.ph/httpdocs/.htaccess`):

```apache
RewriteEngine On

# API Proxy to backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### Step 7: Disable Passenger in Plesk
1. Go to Plesk → Domains → ctpred.com.ph → Node.js
2. **Disable Node.js** (we're using PM2 instead)

### Step 8: Restart Apache
```bash
systemctl restart apache2
```

### Step 9: Test
```bash
# Test backend
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"CTP RED API is running",...}
```

### Step 10: Check Website
Visit: https://ctpred.com.ph

Should work now! ✅

## If Still Not Working

### Check PM2 Status
```bash
pm2 status
pm2 logs ctpredcorp-api
```

### Check if Port 5000 is Open
```bash
netstat -tulpn | grep 5000
```

### Check Apache Proxy Module
```bash
a2enmod proxy
a2enmod proxy_http
systemctl restart apache2
```

### Check Database Connection
```bash
mysql -u your_db_user -p ctpredcorp
```

## Environment Variables

Create `/var/www/vhosts/ctpred.com.ph/httpdocs/backend/.env`:

```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ctpredcorp
JWT_SECRET=your-secret-key
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
```

## Monitoring

```bash
# View logs
pm2 logs ctpredcorp-api

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart ctpredcorp-api
```

## Done!

Your backend should now be running on port 5000, and Apache will proxy API requests to it.

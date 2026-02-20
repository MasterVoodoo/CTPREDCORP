# 🚨 Production Fix Guide - 404 Error on /api/email/send-appointment

## Current Issue

```
/api/email/send-appointment:1  Failed to load resource: the server responded with a status of 404 ()
Error submitting form: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause

The error "Unexpected token '<', '<!DOCTYPE'" means the API is returning HTML instead of JSON, which happens when:
1. Backend Node.js server is **NOT running** on port 5000
2. Apache is returning a 404 HTML page instead of proxying to the backend

## ✅ Step-by-Step Fix

### Step 1: Verify Backend is Running

```bash
# SSH into your production server
ssh your-server

# Check if Node.js backend is running
ps aux | grep node

# OR if using PM2:
pm2 status
```

**Expected Output:**
- You should see a process running `server.js` on port 5000
- If PM2: Status should be "online"

**If NOT running, proceed to Step 2.**

---

### Step 2: Start the Backend Server

#### Option A: Using PM2 (Recommended)

```bash
# Navigate to backend folder
cd /path/to/CTPREDCORP/backend

# Install PM2 globally if not installed
npm install -g pm2

# Start the server
pm2 start server.js --name ctpred-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Check status
pm2 status
pm2 logs ctpred-backend --lines 50
```

#### Option B: Using Node directly (Not recommended for production)

```bash
cd /path/to/CTPREDCORP/backend
NODE_ENV=production PORT=5000 node server.js &
```

---

### Step 3: Test Backend Directly

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"CTP RED API is running"...}

# Test appointment endpoint
curl -X POST http://localhost:5000/api/email/send-appointment \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test","email":"test@test.com","phoneNumber":"123","preferredDate":"2026-03-01","preferredTime":"10:00","property":"Test Building","floor":"1st Floor"}'

# Expected response:
# {"success":true,"message":"Appointment request sent successfully"}
```

**If this works**, the backend is running correctly. The issue is with the frontend.

**If this fails**, check Step 4 for backend troubleshooting.

---

### Step 4: Backend Troubleshooting

#### Check Backend Environment File

```bash
cd /path/to/CTPREDCORP/backend
cat .env
```

**Required variables:**
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ctpred
JWT_SECRET=your-secret-key
```

#### Check Backend Logs

```bash
# If using PM2
pm2 logs ctpred-backend --lines 100

# Check for errors related to:
# - Database connection
# - Port already in use
# - Missing dependencies
```

#### Common Backend Issues

**Issue: Port 5000 already in use**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Restart backend
pm2 restart ctpred-backend
```

**Issue: Database connection failed**
```bash
# Test MySQL connection
mysql -u your_user -p

# Check if database exists
SHOW DATABASES LIKE 'ctpred';

# Check appointments table
USE ctpred;
SHOW TABLES LIKE 'appointments';
```

---

### Step 5: Rebuild and Redeploy Frontend

```bash
# On your local machine or server
cd /path/to/CTPREDCORP

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build for production
npm run build

# Copy to httpdocs (adjust path as needed)
cp -r dist/* /path/to/httpdocs/

# OR if using Plesk File Manager:
# 1. Download the dist folder
# 2. Upload all files from dist/ to httpdocs/ via Plesk
```

---

### Step 6: Verify .htaccess Configuration

Your `.htaccess` in httpdocs should contain:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On

# 1. API PROXY to Node.js (CRITICAL)
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]

# 2. Serve React static files
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 3. SPA fallback to index.html
RewriteRule ^ /index.html [L]
</IfModule>

# MIME types for JS/CSS
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType module application/javascript .mjs
    AddType text/css .css
</IfModule>
```

**⚠️ IMPORTANT:** The `[P]` flag requires `mod_proxy` to be enabled in Apache.

#### Enable mod_proxy in Plesk/Apache

```bash
# Enable required Apache modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

# Restart Apache
sudo systemctl restart apache2
# OR on some systems:
sudo service apache2 restart
```

---

### Step 7: Test the Full Flow

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Navigate to** https://ctpred.com.ph
4. **Fill out appointment form**
5. **Submit form**
6. **Check Network tab:**
   - Look for `/api/email/send-appointment` request
   - Status should be `200 OK`
   - Response should be JSON: `{"success":true,...}`

**If you see 404:**
- Backend is not running → Go back to Step 2
- Apache proxy not working → Check Step 6

**If you see HTML response:**
- Apache is not proxying → Check mod_proxy is enabled

---

## 🔍 Quick Diagnostic Commands

Run these to quickly diagnose the issue:

```bash
# 1. Is backend running?
pm2 status | grep ctpred
# OR
ps aux | grep "server.js"

# 2. Is backend responding?
curl http://localhost:5000/api/health

# 3. Is Apache proxying correctly?
curl http://127.0.0.1/api/health

# 4. Check Apache error logs
tail -f /var/log/apache2/error.log
# OR in Plesk:
tail -f /var/www/vhosts/ctpred.com.ph/logs/error_log

# 5. Check backend logs
pm2 logs ctpred-backend --lines 50
```

---

## ✅ Success Checklist

- [ ] Backend runs on port 5000: `pm2 status` shows "online"
- [ ] Backend responds: `curl http://localhost:5000/api/health` returns JSON
- [ ] Apache proxies: `curl http://127.0.0.1/api/health` returns same JSON
- [ ] Frontend builds successfully: `npm run build` completes
- [ ] Frontend deployed: Files in `httpdocs/` are from latest build
- [ ] `.htaccess` is correct and in `httpdocs/`
- [ ] mod_proxy is enabled: `apache2ctl -M | grep proxy`
- [ ] Website loads: https://ctpred.com.ph works
- [ ] Appointment form works: Submit form returns success
- [ ] No errors in browser console

---

## 🆘 Still Not Working?

### Enable Detailed Logging

**Backend (server.js):**
```javascript
// Already has detailed logs
// Check: pm2 logs ctpred-backend
```

**Apache (.htaccess):**
```apache
# Add before RewriteRule
RewriteLog "/var/log/apache2/rewrite.log"
RewriteLogLevel 3
```

### Check Firewall

```bash
# Check if port 5000 is accessible locally
telnet localhost 5000

# If firewall is blocking:
sudo ufw allow 5000/tcp
# OR
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
```

### Nuclear Option: Full Restart

```bash
# Stop everything
pm2 stop all
sudo systemctl stop apache2

# Start backend first
cd /path/to/CTPREDCORP/backend
pm2 start server.js --name ctpred-backend
pm2 logs ctpred-backend --lines 20

# Wait for "Server running on http://localhost:5000"

# Test backend
curl http://localhost:5000/api/health

# Start Apache
sudo systemctl start apache2

# Test through Apache
curl http://127.0.0.1/api/health

# Test from browser
https://ctpred.com.ph/api/health
```

---

## 📞 Support Information

**If stuck, provide these details:**

1. Output of: `pm2 status`
2. Output of: `curl http://localhost:5000/api/health`
3. Output of: `curl http://127.0.0.1/api/health`
4. Browser Network tab screenshot showing the failed request
5. Output of: `pm2 logs ctpred-backend --lines 50`
6. Output of: `tail -f /var/log/apache2/error.log` (during form submission)

---

**Last Updated:** February 20, 2026

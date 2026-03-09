# ✅ Plesk Deployment Quick Checklist

## 🎯 Your Current Issue
Backend returns 500 error because Passenger can't start Node.js app.

## 🔧 Quick Fix (5 Steps)

### ✅ Step 1: Update Plesk Node.js Settings

**Go to: Plesk → ctpred.com.ph → Node.js**

**Change these 3 settings:**

| Setting | Current (Wrong) | Should Be (Correct) |
|---------|----------------|---------------------|
| Application Root | `/httpdocs/backend` ❌ | `/httpdocs` ✅ |
| Application Startup File | `server.js` ❌ | `backend/server.js` ✅ |
| NODE_ENV | `development` ❌ | `production` ✅ |

**Screenshot of correct settings:**
```
Node.js Version: 20.20.1
Document Root: /httpdocs
Application Root: /httpdocs              ← CHANGE THIS
Application Startup File: backend/server.js  ← CHANGE THIS
Application Mode: production
```

### ✅ Step 2: Add Missing Environment Variable

In Plesk Node.js → Custom environment variables:

**Add this:**
```
FRONTEND_URL: https://ctpred.com.ph
```

**Change this:**
```
NODE_ENV: production  (currently "development")
```

### ✅ Step 3: Upload New Files

**Upload to `/httpdocs/`:**

1. **package.json** (from project root - I just updated it)
2. **.htaccess** (from project root - I just updated it)

**Your httpdocs should have:**
```
httpdocs/
├── package.json      ← NEW (upload this)
├── .htaccess         ← UPDATED (upload this)
├── index.html        ← Already there
├── assets/           ← Already there
└── backend/          ← Already there
```

### ✅ Step 4: Run NPM Install in Plesk

1. In Plesk Node.js settings
2. Click **"NPM Install"** button
3. Wait for completion (check for errors)

### ✅ Step 5: Restart App

1. Click **"Restart App"** button in Plesk
2. Wait 10-15 seconds
3. Test: Visit `https://ctpred.com.ph/api/health`

## 🧪 Testing

### Test 1: API Health
```
Visit: https://ctpred.com.ph/api/health
Expected: {"status":"OK","message":"CTP RED API is running"}
```

### Test 2: Buildings API
```
Visit: https://ctpred.com.ph/api/buildings
Expected: [array of buildings]
```

### Test 3: Website
```
Visit: https://ctpred.com.ph
Expected: Website loads, no 500 errors in console
```

## 🚨 If Still Not Working

### Option A: Check Passenger Logs

**SSH into server:**
```bash
tail -f /var/log/passenger.log
```

Look for error messages.

### Option B: Use PM2 Instead (Easier)

**SSH into server:**
```bash
# Go to backend folder
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend

# Install dependencies
npm install --production

# Install PM2
npm install -g pm2

# Start backend
pm2 start server.js --name ctpredcorp-api

# Save configuration
pm2 save
pm2 startup

# Test
curl http://localhost:5000/api/health
```

**Then in Plesk:**
1. **Disable Node.js** (since PM2 is handling it)
2. Restart Apache

**Update .htaccess to proxy to PM2:**
```apache
RewriteEngine On

# Proxy API to PM2 backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

## 📝 Files to Upload

I've updated these files for you:

1. **`package.json`** - Root package.json (upload to `/httpdocs/`)
2. **`.htaccess`** - Production .htaccess (upload to `/httpdocs/`)
3. **`PLESK_STEP_BY_STEP.md`** - Detailed guide
4. **`backend/ecosystem.config.js`** - PM2 config (if using PM2)

## 🎯 Summary

**The 3 key changes in Plesk:**

1. **Application Root**: `/httpdocs` (not `/httpdocs/backend`)
2. **Application Startup File**: `backend/server.js` (not `server.js`)
3. **NODE_ENV**: `production` (not `development`)

After making these changes and clicking "Restart App", your backend should start successfully!

## 💡 Pro Tip

If Passenger continues to give you trouble, **use PM2** (Option B above). It's more reliable and easier to debug. Many production Node.js apps use PM2 instead of Passenger.

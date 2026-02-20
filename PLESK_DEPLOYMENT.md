# 🎛️ Plesk Deployment Guide (No SSH Required)

## Overview

This guide shows how to deploy and manage the CTP RED application entirely through Plesk Panel, without SSH access.

---

## 🚨 Current Issue: Backend Not Running

The error you're seeing means the Node.js backend server is not running. In Plesk, you need to set up Node.js application hosting.

---

## ✅ Step-by-Step Setup in Plesk

### Step 1: Enable Node.js in Plesk

1. **Log into Plesk Panel**
2. **Go to your domain** (ctpred.com.ph)
3. **Look for "Node.js" in the left sidebar**
   - If you don't see it, Node.js extension needs to be installed by your hosting provider

---

### Step 2: Set Up Node.js Application

#### Option A: Using Plesk Node.js Manager

1. **Click "Node.js"** in your domain settings
2. **Click "Enable Node.js"**
3. **Configure:**
   ```
   Node.js version: 18.x or 20.x (latest LTS)
   Application mode: production
   Application root: /backend
   Application startup file: server.js
   ```
4. **Click "Enable Node.js"**
5. **Set Environment Variables:**
   - Click "Environment Variables" or "Custom environment variables"
   - Add these:
     ```
     NODE_ENV=production
     PORT=5000
     DB_HOST=localhost
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=ctpred
     JWT_SECRET=your-secure-random-string
     CLIENT_URL=https://ctpred.com.ph
     FRONTEND_URL=https://ctpred.com.ph
     ```

6. **Click "Restart App"**

#### Option B: Using Plesk Scheduled Tasks (If Node.js Manager unavailable)

If Plesk doesn't have Node.js manager, you can run the backend as a scheduled task:

1. **Go to "Scheduled Tasks"** (Cron Jobs)
2. **Add New Task:**
   ```
   Command: cd /var/www/vhosts/ctpred.com.ph/CTPREDCORP/backend && node server.js >> /var/www/vhosts/ctpred.com.ph/logs/node.log 2>&1 &
   Schedule: @reboot (run once at startup)
   ```

**⚠️ Note:** This is not ideal for production but works if Node.js hosting is not available.

---

### Step 3: Upload Backend Files via Plesk File Manager

1. **Go to "Files" → "File Manager"**
2. **Navigate to your domain folder** (e.g., `/httpdocs/`)
3. **Create folder structure:**
   ```
   /httpdocs/          (frontend files)
   /backend/           (backend application)
   ```

4. **Upload backend files:**
   - Option 1: Upload `backend` folder as ZIP and extract
   - Option 2: Use Git in Plesk (if available)
   - Option 3: Use FTP client (FileZilla)

5. **Create `.env` file in `/backend/` folder:**
   - Click "+ Add File" → Name it `.env`
   - Edit and paste:
     ```env
     NODE_ENV=production
     PORT=5000
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=ctpred
     DB_PORT=3306
     JWT_SECRET=your-secure-secret-key-here
     CLIENT_URL=https://ctpred.com.ph
     FRONTEND_URL=https://ctpred.com.ph
     COMPANY_EMAIL=aseantower@ctpred.com.ph
     ```

---

### Step 4: Install Backend Dependencies in Plesk

#### If Plesk has Node.js Manager:
1. **Go to Node.js settings**
2. **Click "NPM Install"** or run `npm install` button
3. Wait for installation to complete

#### If using Plesk Terminal (if available):
1. **Go to "Tools & Settings" → "Web Terminal"**
2. **Run:**
   ```bash
   cd /var/www/vhosts/ctpred.com.ph/backend
   npm install
   ```

#### If no terminal access:
You'll need to:
1. Install dependencies locally on your computer
2. Upload the entire `node_modules` folder (large, not recommended)
3. OR ask hosting provider to enable SSH/Terminal access

---

### Step 5: Configure Database in Plesk

1. **Go to "Databases" → "MySQL Databases"**
2. **Create database:**
   - Database name: `ctpred`
   - User: Create new user with password
   - Grant all privileges

3. **Import database structure:**
   - Click "phpMyAdmin"
   - Select `ctpred` database
   - Click "Import"
   - Upload your SQL file or create tables manually

4. **Verify tables exist:**
   - Check for: `appointments`, `buildings`, `units`, `admin_users`, etc.

---

### Step 6: Build and Upload Frontend

#### On Your Local Computer:

```bash
cd /path/to/CTPREDCORP
git pull origin main
npm install
npm run build
```

This creates a `dist/` folder with built files.

#### Upload to Plesk:

1. **Go to "Files" → "File Manager"**
2. **Navigate to `/httpdocs/`**
3. **Delete old files** (backup first!)
4. **Upload all files from `dist/` folder:**
   - `index.html`
   - `assets/` folder
   - `src/` folder (if contains images)
   - Any other files from `dist/`

5. **Verify `.htaccess` exists in `/httpdocs/`:**
   ```apache
   <IfModule mod_rewrite.c>
   RewriteEngine On
   
   # API PROXY to Node.js backend
   RewriteCond %{REQUEST_URI} ^/api/ [NC]
   RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]
   
   # Serve static files
   RewriteCond %{REQUEST_FILENAME} -f [OR]
   RewriteCond %{REQUEST_FILENAME} -d
   RewriteRule ^ - [L]
   
   # SPA fallback
   RewriteRule ^ /index.html [L]
   </IfModule>
   
   <IfModule mod_mime.c>
       AddType application/javascript .js
       AddType module application/javascript .mjs
       AddType text/css .css
   </IfModule>
   ```

---

### Step 7: Enable Apache Modules in Plesk

**⚠️ Critical:** Apache needs `mod_proxy` to forward API requests to Node.js

1. **Go to "Tools & Settings"**
2. **Click "Apache Web Server"**
3. **Look for "Modules" or contact your hosting provider**
4. **Required modules:**
   - `mod_rewrite` (should be enabled by default)
   - `mod_proxy`
   - `mod_proxy_http`

**If you can't enable these:**
- Contact your hosting provider: "Please enable mod_proxy and mod_proxy_http for Apache"
- Without these, API proxying won't work

---

### Step 8: Test Everything

#### Test Backend (in Plesk):

1. **Check if Node.js app is running:**
   - Go to Node.js settings
   - Status should show "Running" or "Active"

2. **Check logs:**
   - Look for "Logs" or "Application logs"
   - Should see: "Server running on http://localhost:5000"

#### Test in Browser:

1. **Open browser DevTools** (F12)
2. **Visit:** `https://ctpred.com.ph/api/health`
3. **Should see:** `{"status":"OK","message":"CTP RED API is running"}`

4. **Try appointment form:**
   - Fill and submit
   - Check Network tab for `/api/email/send-appointment`
   - Should return: `{"success":true}`

---

## 🔄 Alternative: Contact Hosting Provider

If Plesk doesn't have Node.js support, you need to ask your hosting provider:

```
Hello,

I need to run a Node.js application on my domain (ctpred.com.ph).
Can you please:

1. Enable Node.js hosting for my domain
2. Enable Apache modules: mod_proxy and mod_proxy_http
3. Allow my Node.js app to run on port 5000
4. OR provide SSH access so I can manage it myself

The application is already built and ready to deploy.

Thank you!
```

---

## 🎯 Troubleshooting Without SSH

### Backend Not Starting?

**Check in Plesk:**
- **Node.js Status:** Should show "Running"
- **Logs:** Look for error messages
- **Port:** Make sure port 5000 is not used by another app

**Common Errors:**

**"Port already in use"**
- Stop other Node.js apps in Plesk
- Change PORT in .env to different number (e.g., 5001)
- Update .htaccess to match new port

**"Cannot connect to database"**
- Verify DB credentials in `.env`
- Check database exists in Plesk → Databases
- Try phpMyAdmin to test connection

**"Module not found"**
- Run "NPM Install" again in Node.js settings
- Or upload node_modules folder

### Frontend Issues?

**Check:**
- All files from `dist/` are in `/httpdocs/`
- `.htaccess` exists and is correct
- `index.html` is in root of `/httpdocs/`

**Clear cache:**
- Browser: Ctrl+Shift+R (hard refresh)
- Plesk: May have cache settings to clear

---

## 📋 Quick Checklist

- [ ] Node.js enabled in Plesk for domain
- [ ] Backend files uploaded to `/backend/` folder
- [ ] `.env` file created with all variables
- [ ] NPM dependencies installed
- [ ] Database created and tables imported
- [ ] Node.js application is running (check status)
- [ ] Frontend built locally: `npm run build`
- [ ] Frontend files uploaded to `/httpdocs/`
- [ ] `.htaccess` is correct and in `/httpdocs/`
- [ ] mod_proxy enabled in Apache
- [ ] Test: `/api/health` returns JSON
- [ ] Test: Appointment form works

---

## 🆘 If Still Not Working

**Provide these details:**

1. **Plesk version:** (check bottom-right corner)
2. **Node.js status:** Screenshot from Plesk Node.js settings
3. **Logs:** Copy any error messages from Node.js logs
4. **Browser error:** Screenshot of browser console (F12)
5. **Hosting provider:** Who provides your hosting?

**Most likely issue:** Hosting plan doesn't support Node.js

**Solution options:**
1. Upgrade hosting plan to include Node.js
2. Use separate backend hosting (e.g., DigitalOcean, Railway, Render)
3. Request SSH access from provider
4. Switch to a Node.js-friendly host

---

## 🚀 Alternative Backend Hosting

If your current host doesn't support Node.js, you can host the backend separately:

### Free/Cheap Options:

**Railway.app** (Recommended):
- Deploy backend in 5 minutes
- Free tier available
- Automatic deployments from GitHub
- Get backend URL: `https://your-app.railway.app`

**Render.com:**
- Similar to Railway
- Free tier with limitations
- Easy deployment

**Then:**
1. Deploy backend to Railway/Render
2. Get backend URL (e.g., `https://ctpred-api.railway.app`)
3. Update `.env.production` in your repo:
   ```
   VITE_API_URL=https://ctpred-api.railway.app
   ```
4. Rebuild frontend: `npm run build`
5. Upload to Plesk `/httpdocs/`

---

**Last Updated:** February 20, 2026

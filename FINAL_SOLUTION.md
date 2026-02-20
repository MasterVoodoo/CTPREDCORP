# 🚨 FINAL SOLUTION: 404 API Error

## The Problem

```
POST https://ctpred.com.ph/api/email/send-appointment 404 (Not Found)
Error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Translation:** Apache is returning an HTML 404 page because there's NO backend server running.

---

## 📍 Root Cause

Your `.htaccess` tries to proxy `/api/*` requests to `http://127.0.0.1:5000`, but:

1. ❌ **No Node.js server is running on port 5000**
2. ❌ Apache returns HTML 404 error page
3. ❌ Your frontend expects JSON, gets HTML
4. ❌ Error: "Unexpected token '<'"

---

## ✅ THE ONLY SOLUTIONS

You **MUST** choose one of these. There is no other way:

---

### **Solution 1: Use Railway.app (RECOMMENDED - 10 minutes)**

This is the **easiest and fastest** solution.

#### **Step 1: Deploy Backend to Railway**

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login with GitHub"**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **`MasterVoodoo/CTPREDCORP`**
6. Railway will ask for configuration:
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`
   - Click **"Deploy"**

7. **Add Variables** (click "Variables" tab):
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=your_database_host
   DB_USER=your_database_user  
   DB_PASSWORD=your_database_password
   DB_NAME=ctpred
   JWT_SECRET=any-long-random-string-here-min-32-chars
   CLIENT_URL=https://ctpred.com.ph
   FRONTEND_URL=https://ctpred.com.ph
   COMPANY_EMAIL=aseantower@ctpred.com.ph
   ```

8. **Get your Railway URL** (looks like `https://ctpred-production-abc123.railway.app`)

#### **Step 2: Update Frontend to Use Railway Backend**

**On your computer:**

1. Edit `.env.production`:
   ```env
   VITE_API_URL=https://your-app-name.railway.app
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. **Upload ONLY these files from `dist/` to Plesk `/httpdocs/`:**
   - `index.html`
   - `assets/` folder
   - Any other files in `dist/`
   - **DO NOT upload `.htaccess`** (or use simplified version below)

4. **Update `.htaccess` in `/httpdocs/`** (simplified, no proxy needed):
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       
       # Serve static files
       RewriteCond %{REQUEST_FILENAME} -f [OR]
       RewriteCond %{REQUEST_FILENAME} -d
       RewriteRule ^ - [L]
       
       # SPA fallback
       RewriteRule ^ /index.html [L]
   </IfModule>
   
   <IfModule mod_mime.c>
       AddType application/javascript .js
       AddType text/css .css
   </IfModule>
   ```

5. **Test:** Open `https://ctpred.com.ph` and submit appointment form

**✅ Done! Backend on Railway, Frontend on Plesk.**

---

### **Solution 2: Enable Node.js in Plesk**

**Only if Plesk supports Node.js:**

1. Log into **Plesk**
2. Go to your **domain settings**
3. Look for **"Node.js"** in sidebar
4. **If you see it:**
   - Click "Enable Node.js"
   - Application root: `/backend`
   - Application URL: leave blank or `/api`
   - Startup file: `server.js`
   - Environment: `production`
   - Add all environment variables
   - Click "Enable" then "Restart"

5. **If you DON'T see Node.js option:**
   - Your hosting doesn't support it
   - Use Solution 1 (Railway) instead

---

### **Solution 3: Contact Hosting Provider**

**Email your hosting provider:**

```
Subject: Enable Node.js Support for ctpred.com.ph

Hi,

I need to run a Node.js backend API on my domain (ctpred.com.ph).

Could you please:
1. Enable Node.js hosting for my account
2. Enable Apache modules: mod_proxy and mod_proxy_http  
3. Allow Node.js to run on port 5000
4. OR provide SSH/terminal access

Alternatively, can you confirm if my current hosting plan supports 
Node.js applications? If not, what upgrade do I need?

Thank you!
```

---

## 📊 Comparison of Solutions

| Solution | Setup Time | Monthly Cost | Difficulty | Recommended? |
|----------|-----------|--------------|------------|-------------|
| **Railway.app** | 10 min | Free tier available | ⭐ Easy | ✅ **YES** |
| **Plesk Node.js** | 5 min | Included if available | ⭐ Easy | ✅ If available |
| **Contact Provider** | Days | Varies | ⭐⭐ Medium | 🔶 Last resort |

---

## 🧪 Testing: Is Backend Running?

**After deploying (Railway or Plesk), test:**

### If using Railway:
```bash
# Replace with your Railway URL
curl https://your-app.railway.app/api/health

# Should return:
# {"status":"OK","message":"CTP RED API is running"...}
```

### If using Plesk Node.js:
```bash
curl https://ctpred.com.ph/api/health

# Should return JSON, not HTML
```

### In Browser:
1. Open DevTools (F12)
2. Go to **Network** tab  
3. Visit `https://ctpred.com.ph/api/health`
4. **Should see:**
   - Status: `200 OK`
   - Response: JSON with `{"status":"OK"}`
5. **Should NOT see:**
   - Status: `404`
   - Response: HTML with `<!DOCTYPE`

---

## ✅ Success Checklist

Backend is working when:

- [ ] `/api/health` returns `200 OK` with JSON
- [ ] Appointment form submits without errors
- [ ] Browser console shows no "404" or "ERR_CONNECTION_REFUSED"
- [ ] Network tab shows successful API calls
- [ ] Admin panel can login
- [ ] Database receives appointment records

---

## 🔥 Quick Start: Railway (5 Commands)

```bash
# 1. Deploy backend to Railway (via website)
# 2. Get your Railway URL
# 3. Update frontend:

echo "VITE_API_URL=https://your-app.railway.app" > .env.production
npm run build

# 4. Upload dist/* to Plesk /httpdocs/
# 5. Test: https://ctpred.com.ph
```

**That's it!** 🎉

---

## ⚠️ Important Notes

### Database Connection for Railway:

If your database is on the same server as Plesk, Railway needs to access it:

**Option 1: Public Database Access (Not recommended)**
- Allow external connections in MySQL
- Use public IP in `DB_HOST`
- Set up firewall rules

**Option 2: Use Plesk Database** 
- In Plesk: Databases > Remote MySQL
- Allow connections from Railway's IP
- Use your server's IP as `DB_HOST`

**Option 3: Create New Database on Railway**
- Add MySQL plugin in Railway
- Migrate your data
- Use Railway's internal database

---

## 🐛 Common Mistakes

### Mistake 1: Not Rebuilding Frontend
```bash
# WRONG: Uploading old dist/ files
# RIGHT: Always rebuild after changing .env.production
npm run build
```

### Mistake 2: Wrong Railway URL
```bash
# WRONG: Using backend code URL
VITE_API_URL=https://github.com/MasterVoodoo/CTPREDCORP

# RIGHT: Using Railway deployment URL
VITE_API_URL=https://ctpred-production.railway.app
```

### Mistake 3: Missing Environment Variables
```bash
# Railway MUST have these variables:
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=ctpred
JWT_SECRET=...
```

---

## 📞 Need Help?

**If Railway deployment fails:**
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check database connection from Railway

**If frontend still gets 404:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check `.env.production` has correct Railway URL
3. Verify you rebuilt: `npm run build`
4. Verify uploaded latest `dist/` files

**If appointment form still doesn't work:**
1. Open browser DevTools > Network tab
2. Submit form and check request URL
3. Should go to Railway URL, not localhost
4. Check Railway logs for incoming requests

---

## 🚀 Bottom Line

**You CANNOT run the backend from Plesk without Node.js support.**

**Your only practical options:**
1. ✅ Use Railway.app (10 minutes, free)
2. ✅ Ask provider to enable Node.js in Plesk
3. ❌ Keep getting 404 errors forever

**Choose wisely!** 🚀

---

**Last Updated:** February 20, 2026

# 🚀 Deploy Now - Fix 404 Error

## What I Fixed:

1. ✅ Added both `ctpred.com.ph` AND `ctpredcorp.com.ph` to backend CORS [cite:77]
2. ✅ Set frontend to use same domain for API calls (works on both domains) [cite:78]

---

## 📍 Deployment Steps:

### Step 1: Update Backend on Server

**In Plesk File Manager:**

1. Go to your backend folder (where `server.js` is)
2. **Replace `server.js`** with the new version from GitHub
3. **Restart Node.js application** (in Plesk Node.js settings)
   - OR if using PM2: Restart the process

**OR via Git (if you have it set up):**
```bash
cd /path/to/backend
git pull origin main
# Then restart your Node.js app
```

### Step 2: Rebuild Frontend

**On your local computer:**

```bash
# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

### Step 3: Upload to Plesk

1. **Go to Plesk File Manager**
2. **Navigate to `/httpdocs/`** (or wherever your frontend is served)
3. **Delete old files** (except `.htaccess` - keep it!)
4. **Upload ALL files from `dist/` folder:**
   - `index.html`
   - `assets/` folder (entire folder)
   - Any other files in `dist/`

### Step 4: Test!

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Visit your site:** `https://ctpred.com.ph` OR `https://ctpredcorp.com.ph`
3. **Fill appointment form**
4. **Submit**
5. **Should work! ✅**

---

## 🧐 What Changed?

### Backend (`server.js`):
```javascript
const allowedOrigins = [
  'https://ctpred.com.ph',           // ← Added
  'https://www.ctpred.com.ph',       // ← Added  
  'https://ctpredcorp.com.ph',       // ← Added
  'https://www.ctpredcorp.com.ph',   // ← Added
  // ... localhost for development
];
```

### Frontend (`.env.production`):
```env
VITE_API_URL=
```

Empty value means: **"Use the same domain I'm on for API calls"**

- If user visits `ctpred.com.ph` → API calls go to `ctpred.com.ph/api/*`
- If user visits `ctpredcorp.com.ph` → API calls go to `ctpredcorp.com.ph/api/*`

---

## ✅ Verification

**After deployment, test these:**

### Test 1: Health Check
```bash
curl https://ctpred.com.ph/api/health
curl https://ctpredcorp.com.ph/api/health

# Both should return:
# {"status":"OK","message":"CTP RED API is running"}
```

### Test 2: Appointment Form
1. Visit `https://ctpred.com.ph`
2. Open DevTools (F12) → Network tab
3. Fill and submit appointment form
4. Check Network tab:
   - Request URL should be: `https://ctpred.com.ph/api/email/send-appointment`
   - Status should be: `200 OK`
   - Response should be: `{"success":true,...}`

### Test 3: No Errors
- ✅ No "404 Not Found"
- ✅ No "ERR_CONNECTION_REFUSED"
- ✅ No "Unexpected token '<'"
- ✅ Success message appears

---

## 🐛 If Still Not Working

### Issue: Still getting 404

**Check:**
1. Did you restart the backend after updating `server.js`?
2. Did you rebuild frontend: `npm run build`?
3. Did you upload ALL files from `dist/`?
4. Did you clear browser cache?

**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or open in Incognito/Private window

### Issue: CORS error

**Check backend logs:**
- Should show: "CORS Allowed Origins" with both domains listed
- If not, backend wasn't restarted

**Solution:**
- Restart Node.js app in Plesk
- Check backend logs for startup message

---

## 🆘 Quick Checklist

- [ ] Pulled latest code: `git pull origin main`
- [ ] Updated `backend/server.js` on server
- [ ] Restarted backend (Node.js app or PM2)
- [ ] Rebuilt frontend: `npm run build`
- [ ] Uploaded `dist/*` to Plesk `/httpdocs/`
- [ ] Cleared browser cache
- [ ] Tested: `https://ctpred.com.ph/api/health` returns JSON
- [ ] Tested: Appointment form submits successfully
- [ ] Verified: No errors in browser console

---

## 🎉 Success!

If appointment form works, you're done! The 404 error is fixed.

**What was the issue?**
- Backend only allowed `ctpred.com.ph` in CORS
- But backend was actually running on `ctpredcorp.com.ph`
- Frontend tried to call API on wrong domain
- Now both domains work! ✅

---

**Deployment Date:** $(date +%Y-%m-%d)
**Files Changed:** 2 (server.js, .env.production)
**Status:** Ready to deploy

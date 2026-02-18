# Quick Fix for Plesk 500 Error on /admin

## The Problem
You're seeing:
- `Uncaught SyntaxError: Unexpected token 'export'`
- `Failed to load resource: the server responded with a status of 500`
- `{"error":"Server error"}` on `/admin` route

## The Solution (3 Steps)

### Step 1: Update Backend Environment Variable

In Plesk, go to your `backend/.env` file and **ensure** this line exists:

```env
NODE_ENV=production
```

Your complete `backend/.env` should look like:

```env
DB_HOST=localhost
DB_USER=ctpredcorp
DB_PASSWORD=ctpredcorp_2026
DB_NAME=ctpredcorp_db
DB_PORT=3306

JWT_SECRET=da31d0c021d803b898141e3ac1f13667e65081fcc7fff59be1657683755118c6

PORT=5000
NODE_ENV=production  # <-- THIS IS CRITICAL

CLIENT_URL=https://ctpred.com.ph
```

### Step 2: Upload New Backend Files

1. Pull latest code locally:
   ```bash
   git pull origin main
   ```

2. Upload these backend files to Plesk (overwrite existing):
   - `backend/server.js` (critical update)
   - `backend/package.json`

### Step 3: Restart Node.js App

1. In Plesk, go to **Node.js** section
2. Click **"Restart App"** button
3. Check the logs - you should see:
   ```
   ✅ Production mode: Backend serving API routes only
   ℹ️  Frontend should be served by Apache/Nginx
   ```

## Verify It Works

1. Visit `https://ctpred.com.ph/admin`
2. You should see the admin login page (no more 500 error)
3. Open browser console (F12) - no "Unexpected token 'export'" errors
4. Try logging in - should work!

## What Was Wrong?

The backend was trying to serve frontend files in production, but:
- In Plesk, frontend is served by **Apache** from `httpdocs`
- Backend should **ONLY** handle `/api/*` routes
- The old code had a catch-all route that interfered

## New Behavior

**Development (NODE_ENV=development):**
- Backend serves both API and frontend
- Good for local testing

**Production (NODE_ENV=production):**
- Backend ONLY serves API routes
- Frontend is served by Apache from `httpdocs`
- No interference = no errors!

## Still Having Issues?

### Issue: Still seeing 500 errors
**Solution:**
1. Double-check `NODE_ENV=production` in `backend/.env`
2. Also add it in Plesk Node.js **Environment Variables** section
3. Click **NPM Install** button (reinstall dependencies)
4. **Restart App**

### Issue: "Cannot GET /api/..."
**Solution:**
1. Check that backend is running (Node.js status shows "Running")
2. Verify reverse proxy is configured in Plesk (Nginx directives for `/api/`)

### Issue: CORS errors
**Solution:**
1. Check `CLIENT_URL=https://ctpred.com.ph` in backend `.env`
2. No trailing slash
3. Restart app

---

**Last Updated:** February 18, 2026  
**Status:** ✅ Fix pushed to main branch
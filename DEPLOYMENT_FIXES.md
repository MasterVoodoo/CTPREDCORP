# Deployment Fixes - February 18, 2026

## Issues Fixed

This update resolves critical deployment issues for Plesk hosting environments.

### 1. Hardcoded API URLs Removed

**Problem:** Admin components had hardcoded `http://localhost:5000` URLs, preventing proper production deployment.

**Files Fixed:**
- `src/admin/AdminApp.tsx` - Auth verification endpoint
- `src/admin/pages/AdminLogin.tsx` - Login endpoint
- `src/admin/pages/AdminDashboard.tsx` - Building count, auth verification, and logout endpoints (3 locations)

**Solution:** All API calls now use `import.meta.env.VITE_API_URL` environment variable.

### 2. Environment Configuration Added

**New Files:**
- `.env` - Development environment configuration
- `.env.production` - Production environment configuration

**Development (.env):**
```env
VITE_API_URL=http://localhost:5000
```

**Production (.env.production):**
```env
VITE_API_URL=https://ctpred.com.ph
```

### 3. TypeScript Types Updated

**File:** `src/vite-env.d.ts`

**Added:** Type definitions for environment variables to ensure type safety:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 4. .htaccess Fixed for SPA Routing

**File:** `public/.htaccess`

**Problem:** The previous configuration tried to route `/admin` to a separate `/admin/index.html` file, which doesn't exist in this SPA setup.

**Solution:** Simplified routing to direct all requests to the main `index.html` file, allowing React Router to handle all routes including `/admin`.

**Additional improvements:**
- Added security headers (X-Frame-Options, X-XSS-Protection, X-Content-Type-Options)
- Maintained compression and caching configurations

### 5. Backend Server Fixed for Production (CRITICAL)

**File:** `backend/server.js`

**Problem:** Backend was trying to serve frontend files in production, causing:
- "Unexpected token 'export'" errors
- 500 errors on `/admin` route
- `{"error":"Server error"}` messages

**Root Cause:** 
- Backend had a catch-all route (`app.get('*', ...)`) that tried to serve frontend
- In Plesk, frontend is served by Apache from `httpdocs`, NOT by the Node.js backend
- Backend was looking for `dist` in wrong location and interfering with routing

**Solution:** 
- Development mode: Backend serves frontend (for local testing)
- Production mode: Backend ONLY handles `/api/*` routes
- Added `NODE_ENV` check to separate behaviors
- Frontend is served by Apache/Nginx in production

### 6. Backend Package.json Updated

**File:** `backend/package.json`

**Problem:** `nodemon` not recognized on some systems

**Solution:** Changed `"dev": "nodemon server.js"` to `"dev": "npx nodemon server.js"` to use local installation

## Deployment Instructions

### For Development

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. Start development servers:
   ```bash
   npm run dev:all
   ```

### For Production (Plesk)

1. **Pull Latest Code:**
   ```bash
   git pull origin main
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   ```
   This will use `.env.production` automatically and create the `dist` folder.

3. **Upload to Plesk:**
   - Upload all files from `dist` folder to `httpdocs`
   - Upload `public/.htaccess` to `httpdocs/.htaccess`
   - Upload updated `backend` folder files

4. **Backend Configuration:**
   Your backend `.env` **MUST** have `NODE_ENV=production`:
   ```env
   DB_HOST=localhost
   DB_USER=ctpredcorp
   DB_PASSWORD=ctpredcorp_2026
   DB_NAME=ctpredcorp_db
   DB_PORT=3306
   
   JWT_SECRET=da31d0c021d803b898141e3ac1f13667e65081fcc7fff59be1657683755118c6
   
   PORT=5000
   NODE_ENV=production  # CRITICAL - Must be set to 'production'
   
   CLIENT_URL=https://ctpred.com.ph
   ```

5. **Restart Node.js App:**
   - Go to Plesk Node.js Manager
   - Click "Restart App"
   - Check logs to verify it says "Production mode: Backend serving API routes only"

6. **Test:**
   - Visit `https://ctpred.com.ph` - Main site should load
   - Visit `https://ctpred.com.ph/admin` - Admin login should appear (NO 500 ERROR)
   - Try logging in - Should connect to API successfully
   - Check browser console - NO "Unexpected token 'export'" errors

## What Changed in Each File

| File | Changes | Impact |
|------|---------|--------|
| `.env` | Created | Development API URL configuration |
| `.env.production` | Created | Production API URL configuration |
| `src/vite-env.d.ts` | Added env types | TypeScript support for env variables |
| `src/admin/AdminApp.tsx` | Replaced hardcoded URL (1x) | Auth verification now uses env variable |
| `src/admin/pages/AdminLogin.tsx` | Replaced hardcoded URL (1x) | Login now uses env variable |
| `src/admin/pages/AdminDashboard.tsx` | Replaced hardcoded URLs (3x) | All API calls now use env variable |
| `public/.htaccess` | Fixed routing logic | Admin routes now work correctly |
| `backend/server.js` | **CRITICAL FIX** | Separate dev/prod behavior, fixes 500 errors |
| `backend/package.json` | Use npx for nodemon | Fixes local development issues |

## Testing Checklist

### Development Environment
- [ ] Main site loads at `http://localhost:5173`
- [ ] Admin loads at `http://localhost:5173/admin`
- [ ] Admin login works
- [ ] API calls connect to `http://localhost:5000`
- [ ] Backend serves both API and frontend

### Production Environment
- [ ] Main site loads at `https://ctpred.com.ph`
- [ ] Admin loads at `https://ctpred.com.ph/admin` (NO 500 ERROR)
- [ ] NO "Unexpected token 'export'" errors
- [ ] Admin login works
- [ ] API calls connect to `https://ctpred.com.ph/api/*`
- [ ] Page refresh on `/admin` route works correctly
- [ ] No CORS errors in browser console
- [ ] Backend only serves API routes (check logs)

## Troubleshooting

### Issue: "Unexpected token 'export'" or 500 errors on /admin
**Cause:** Backend trying to serve frontend files in production
**Solution:** 
1. **CRITICAL:** Set `NODE_ENV=production` in `backend/.env`
2. Restart Node.js app in Plesk
3. Check logs - should say "Production mode: Backend serving API routes only"
4. If still issues, ensure frontend files are in `httpdocs`, not in backend folder

### Issue: Admin shows "Network Error"
**Cause:** API URL misconfiguration
**Solution:** 
1. Check that `.env.production` has `VITE_API_URL=https://ctpred.com.ph`
2. Rebuild frontend: `npm run build`
3. Re-upload `dist` folder to Plesk

### Issue: 404 on `/admin` route
**Cause:** `.htaccess` not uploaded or not working
**Solution:**
1. Ensure `.htaccess` is in `httpdocs` root
2. Enable "Allow directory (htaccess) override" in Plesk Apache settings
3. Restart Apache

### Issue: CORS errors
**Cause:** `CLIENT_URL` mismatch in backend
**Solution:**
1. Check `backend/.env` has `CLIENT_URL=https://ctpred.com.ph` (no trailing slash)
2. Restart Node.js app in Plesk

### Issue: Backend serves wrong content
**Cause:** `NODE_ENV` not set correctly
**Solution:**
1. Verify `backend/.env` has `NODE_ENV=production`
2. Also set in Plesk Node.js environment variables
3. Restart app

## Commits Made

1. **81475387** - Add frontend environment configuration for development
2. **7898f187** - Add frontend production environment configuration
3. **8f2cbe34** - Add environment variable types for VITE_API_URL
4. **21fdda9e** - Replace hardcoded API URL with environment variable in AdminApp
5. **69f5c3e9** - Replace hardcoded API URL with environment variable in AdminLogin
6. **196d7e20** - Replace hardcoded API URLs with environment variable in AdminDashboard
7. **c64e8412** - Fix .htaccess to properly handle SPA routing including /admin routes
8. **9d2fc9c0** - Use npx for nodemon to avoid installation issues
9. **1616a7c0** - **CRITICAL:** Fix server.js to not interfere with frontend routing in production

## Architecture Overview

### Development Environment
```
Localhost:5173 (Vite Dev Server)
         ↓
    React App
         ↓
Localhost:5000 (Express Server)
         ↓
   MySQL Database
```

### Production Environment (Plesk)
```
ctpred.com.ph (Apache)
         ↓
    httpdocs/ (Static Files)
         ↓
    React App (Client-side)
         ↓
Internal Proxy: /api/* → localhost:5000
         ↓
   Node.js Backend (Express)
         ↓
   MySQL Database
```

**Key Points:**
- Frontend and backend are **completely separate** in production
- Apache serves frontend from `httpdocs`
- Nginx proxy routes `/api/*` to Node.js backend
- Backend **does NOT** serve frontend files in production

---

**Status:** ✅ All critical issues resolved and pushed to main branch

**Last Updated:** February 18, 2026 - 7:23 PM PST

**Author:** Development Team via Perplexity AI
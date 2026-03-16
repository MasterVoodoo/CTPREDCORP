# Troubleshooting Guide

## Issue: Search Selection Empty / Error Loading Data

### Symptoms
- Hero search dropdown is empty
- `/#all-available-spaces` shows "Error Loading Data"
- Message: "Failed to load data. Please ensure the backend is running."
- Backend IS running but frontend can't connect

### Solution Steps

#### 1. Verify Backend is Running

Open terminal and check:
```bash
cd backend
npm run dev
```

You should see:
```
🚀 CTP RED Backend Server Started
📍 Server URL: http://localhost:5000
```

#### 2. Test Backend API Directly

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test buildings endpoint
curl http://localhost:5000/api/buildings

# Test units endpoint
curl http://localhost:5000/api/units
```

If these work, your backend is fine. The issue is frontend connection.

#### 3. Check Your .env File

**CRITICAL:** Create a `.env` file in your **ROOT directory** (not in backend folder):

```env
VITE_API_URL=http://localhost:5000/api
```

**Important Notes:**
- File must be named `.env` exactly (with the dot)
- Must be in the root folder (same level as package.json)
- Include `/api` at the end of the URL
- No quotes around the value
- No trailing slash

#### 4. Restart Frontend Development Server

After creating/modifying `.env`, you MUST restart:

```bash
# Stop the dev server (Ctrl+C)
# Then start again:
npm run dev
```

Vite only reads `.env` on startup!

#### 5. Check Browser Console

Open browser DevTools (F12) and look for:

**Good signs:**
```
🔗 API Base URL: http://localhost:5000/api
📡 Fetching: http://localhost:5000/api/buildings
✅ API Response: [...]
```

**Bad signs:**
```
❌ Error fetching /buildings: Failed to fetch
❌ API Error 404: Not Found
❌ CORS Error
```

#### 6. Check Network Tab

In DevTools → Network tab:
- Look for requests to `http://localhost:5000/api/buildings`
- Check the status code:
  - **200 OK** = Working! ✅
  - **404 Not Found** = Wrong URL path ❌
  - **Failed** = Backend not running or CORS issue ❌
  - **CORS Error** = Origin not allowed ❌

#### 7. CORS Issues

If you see CORS errors in console:

1. Check your backend is allowing `http://localhost:5173`
2. In `backend/server.js`, the allowed origins should include:
```javascript
'http://localhost:5173',
'http://localhost:3000',
'http://127.0.0.1:5173'
```

3. If you added a new origin, restart the backend server

#### 8. Port Conflicts

**Frontend Default:** Port 5173  
**Backend Default:** Port 5000

If either port is in use:

```bash
# Check what's using port 5000
lsof -i :5000

# Check what's using port 5173
lsof -i :5173

# Kill process if needed
kill -9 <PID>
```

#### 9. Database Connection

If backend starts but API returns errors:

1. Check `backend/.env` has correct database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ctpredcorp_db
DB_PORT=3306
PORT=5000
```

2. Verify MySQL is running:
```bash
# On Windows (XAMPP)
# Open XAMPP Control Panel and start MySQL

# On Mac/Linux
sudo service mysql status
```

3. Check database exists and has data:
```bash
mysql -u root -p
USE ctpredcorp_db;
SHOW TABLES;
SELECT COUNT(*) FROM buildings;
SELECT COUNT(*) FROM units;
```

## Common Issues Checklist

- [ ] Backend is running on port 5000
- [ ] `.env` file exists in root directory
- [ ] `.env` has `VITE_API_URL=http://localhost:5000/api`
- [ ] Frontend dev server was restarted after creating/editing `.env`
- [ ] MySQL database is running
- [ ] Database has buildings and units data
- [ ] Browser console shows API requests
- [ ] No CORS errors in console
- [ ] Network tab shows 200 OK responses

## Testing Sequence

### Step 1: Test Backend Directly
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"CTP RED API is running"}

curl http://localhost:5000/api/buildings
# Should return: [{"id":"ctp-asean-tower",...}, ...]
```

### Step 2: Test from Browser
Open: `http://localhost:5000/api/buildings`

You should see JSON with your buildings.

### Step 3: Check Frontend Environment
Add this to any component temporarily:
```typescript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

Should log: `http://localhost:5000/api`

### Step 4: Test API Service
In browser console on your app:
```javascript
fetch('http://localhost:5000/api/buildings')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should show your buildings array.

## Still Not Working?

### Nuclear Option: Complete Reset

```bash
# 1. Stop everything
# Press Ctrl+C in both terminal windows

# 2. Kill any lingering processes
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# 3. Check .env file
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api

# 4. Restart backend
cd backend
npm run dev
# Wait for "Server Started" message

# 5. In NEW terminal, restart frontend
npm run dev
# Wait for "Local: http://localhost:5173"

# 6. Open browser
open http://localhost:5173

# 7. Open DevTools console (F12)
# Look for API logs
```

## Getting Help

If still stuck, provide these details:

1. Backend console output (full startup log)
2. Frontend console output (all errors)
3. Network tab screenshot showing failed request
4. Contents of your `.env` file
5. Result of `curl http://localhost:5000/api/buildings`
6. Output of `npm run dev` from frontend

# Quick Fix: Passenger Backend Not Starting

## Current Error

```
Error ID: 81fa3e24
Web application could not be started by the Phusion Passenger(R) application server.
```

## What Changed

Phusion Passenger looks for `app.js` by default, but your backend uses `server.js`. I've added the necessary files:

- ✅ `backend/app.js` - Entry point that loads server.js[cite:35]
- ✅ `backend/.htaccess` - Passenger configuration[cite:36]
- ✅ `backend/public/` - Required directory for Passenger[cite:37]

## Step-by-Step Fix

### 1. Pull Latest Changes

On your production server:

```bash
cd /home/ctpredco/public_html
git pull origin main
```

This will download:
- `backend/app.js`
- `backend/.htaccess`
- `backend/public/.gitkeep`

### 2. Update .htaccess Path (if needed)

Check if the path in `.htaccess` matches your actual path:

```bash
cd backend
cat .htaccess
```

If the path is wrong, edit it:
```bash
nano .htaccess
```

Change this line to match your actual server path:
```apache
PassengerAppRoot /home/ctpredco/public_html/backend
```

### 3. Find Correct Node.js Path

```bash
which node
# Example output: /usr/local/bin/node or /home/ctpredco/.nvm/versions/node/v18.20.0/bin/node
```

Update `.htaccess` with the correct path:
```apache
PassengerNodejs /usr/local/bin/node
# OR whatever 'which node' returned
```

### 4. Ensure Dependencies are Installed

```bash
cd /home/ctpredco/public_html/backend
npm install --production
```

### 5. Restart Passenger

```bash
# Create restart file (Passenger watches for this)
touch tmp/restart.txt

# OR use Passenger command
passenger-config restart-app $(pwd)

# OR restart Apache if above doesn't work
sudo systemctl restart apache2
```

### 6. Check if Backend Starts

Test the API:

```bash
# From server
curl http://localhost:5000/api/health

# From outside
curl https://ctpred.com.ph/api/health
```

Should return:
```json
{"status":"OK","message":"CTP RED API is running"}
```

## If Still Not Working

### Check Error Logs

```bash
# Apache error log
sudo tail -100 /var/log/apache2/error.log | grep -A 20 "81fa3e24"

# Passenger log (location may vary)
sudo tail -100 /var/log/passenger.log

# Your cPanel error log (if using cPanel)
tail -100 ~/public_html/error_log
```

### Common Issues

#### Issue 1: Wrong Node.js Path

**Symptom**: Passenger can't find Node.js

**Fix**: Update `PassengerNodejs` in `.htaccess`:
```bash
which node
# Use that path in .htaccess
```

#### Issue 2: Missing node_modules

**Symptom**: "Cannot find module 'express'"

**Fix**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install --production
```

#### Issue 3: Wrong App Path

**Symptom**: "App root directory doesn't exist"

**Fix**: Update `PassengerAppRoot` in `.htaccess` to actual path:
```bash
pwd
# Use that output in PassengerAppRoot
```

#### Issue 4: Database Connection Failed

**Symptom**: Backend starts but crashes immediately

**Fix**: Check `backend/.env` has correct MySQL credentials:
```bash
cat backend/.env

# Test database connection
mysql -u ctpredcorp -pctpredcorp_2026 -e "USE ctpredcorp_db; SELECT COUNT(*) FROM buildings;"
```

#### Issue 5: Port Already in Use

**Symptom**: "Port 5000 is already in use"

**Fix**: Change port in `backend/.env`:
```env
PORT=5001
```

Then update any Apache/Nginx proxy config to use new port.

## Alternative: Start Backend Manually with PM2

If Passenger continues to fail, use PM2 instead:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd /home/ctpredco/public_html/backend
pm2 start app.js --name ctpred-api
pm2 save
pm2 startup

# PM2 will give you a command to run, copy and paste it
```

Then configure Apache to proxy `/api` to `http://localhost:5000`.

## Verify It's Working

### From Browser

Open: https://ctpred.com.ph/api/health

Should see:
```json
{"status":"OK","message":"CTP RED API is running"}
```

### From Command Line

```bash
curl https://ctpred.com.ph/api/buildings
# Should return JSON array of buildings, not HTML error
```

## After It's Fixed

Your website should:
1. ✅ Show buildings in the search dropdown
2. ✅ Load units on the "All Available Spaces" page
3. ✅ No more 500 errors in browser console
4. ✅ No more Passenger error pages

## Need More Help?

Provide these details:

1. **Error log output**:
   ```bash
   sudo tail -50 /var/log/apache2/error.log
   ```

2. **Current directory structure**:
   ```bash
   ls -la /home/ctpredco/public_html/backend/
   ```

3. **Node.js version**:
   ```bash
   node --version
   npm --version
   ```

4. **Test backend manually**:
   ```bash
   cd backend
   node app.js
   # What error does this show?
   ```

5. **.htaccess contents**:
   ```bash
   cat backend/.htaccess
   ```

# Production Deployment Guide

## Issue Fixed

### Problem
- `/api/email/send-appointment` returned 404 in production
- "Unexpected token 'export'" syntax error
- Frontend couldn't communicate with backend API

### Solution
- Fixed server.js to properly handle API routes in production
- Removed aggressive 404 handler that was blocking requests
- Added proper CORS configuration for production domain
- Separated frontend serving from API routing

## Deployment Steps

### 1. **Pull Latest Changes**
```bash
cd /path/to/CTPREDCORP
git pull origin main
```

### 2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### 3. **Set Environment Variables**

Create/Update `backend/.env`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ctpred
DB_PORT=3306

# CORS Configuration
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph

# JWT Secret
JWT_SECRET=your-secure-random-string-here

# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
COMPANY_EMAIL=aseantower@ctpred.com.ph
```

### 4. **Restart Backend Server**

#### Using PM2 (Recommended):
```bash
cd backend
pm2 restart ctpred-backend

# OR if first time:
pm2 start server.js --name ctpred-backend
pm2 save
pm2 startup
```

#### Using Node directly:
```bash
cd backend
NODE_ENV=production node server.js
```

### 5. **Build Frontend**
```bash
cd /path/to/CTPREDCORP
npm install
npm run build
```

### 6. **Deploy Frontend to httpdocs**

#### Option A: Copy dist folder contents
```bash
# Backup old files first
cp -r httpdocs httpdocs.backup.$(date +%Y%m%d)

# Copy new build
cp -r dist/* httpdocs/
```

#### Option B: Symlink (if both are on same server)
```bash
ln -sf /path/to/CTPREDCORP/dist/* /path/to/httpdocs/
```

### 7. **Verify Deployment**

Test these URLs:

```bash
# Health check
curl https://ctpred.com.ph/api/health

# Should return: {"status":"OK","message":"CTP RED API is running"...}

# Test appointment endpoint
curl -X POST https://ctpred.com.ph/api/email/send-appointment \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test","email":"test@test.com","phoneNumber":"123","preferredDate":"2026-03-01","preferredTime":"10:00","property":"Test","floor":"1"}'
```

## Architecture

### Production Setup

```
User Browser
     |
     v
Apache/Nginx (Port 80/443)
     |
     ├──> Serves static files from httpdocs/ (HTML, CSS, JS)
     └──> Proxies /api/* requests to Node.js backend (Port 5000)
              |
              v
         Node.js Backend (Port 5000)
              |
              v
         MySQL Database
```

### File Structure

```
Production Server:
├── httpdocs/                    # Apache/Nginx document root
│   ├── index.html              # Frontend entry point
│   ├── assets/                 # Built JS/CSS
│   └── src/                    # Static assets
│
└── CTPREDCORP/                 # Application repository
    ├── backend/                # Backend API
    │   ├── server.js           # API server (Port 5000)
    │   ├── routes/             # API routes
    │   └── .env                # Environment config
    ├── dist/                   # Built frontend (copy to httpdocs)
    └── src/                    # Source code
```

## Apache Configuration

If using Apache, add to your `.htaccess` or VirtualHost config:

```apache
# Enable RewriteEngine
RewriteEngine On

# Proxy API requests to Node.js backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Serve static files or fallback to index.html for client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

## Nginx Configuration

If using Nginx:

```nginx
server {
    listen 80;
    server_name ctpred.com.ph www.ctpred.com.ph;
    root /path/to/httpdocs;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Troubleshooting

### 1. API Returns 404

**Check if backend is running:**
```bash
pm2 status
# OR
ps aux | grep node
```

**Check backend logs:**
```bash
pm2 logs ctpred-backend
# OR
tail -f backend/logs/error.log
```

**Test backend directly:**
```bash
curl http://localhost:5000/api/health
```

### 2. CORS Errors

**Check allowed origins in `backend/.env`:**
```env
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
```

**Check browser console for exact error**

### 3. Database Connection Errors

**Test MySQL connection:**
```bash
mysql -u your_user -p ctpred
```

**Check database credentials in `.env`**

### 4. "Unexpected token 'export'" Error

**This means:**
- Frontend JavaScript is not being properly served
- OR backend is trying to serve frontend files

**Solution:**
- Ensure `NODE_ENV=production` is set
- Verify frontend is built: `npm run build`
- Check `dist/` folder exists and has files
- Copy `dist/` contents to `httpdocs/`

### 5. Appointment Form Not Working

**Check:**
1. Backend is running: `pm2 status`
2. API endpoint responds: `curl http://localhost:5000/api/health`
3. Database table exists:
   ```sql
   USE ctpred;
   SHOW TABLES LIKE 'appointments';
   ```
4. Browser console for errors
5. Network tab for failed requests

## Monitoring

### Check Backend Status
```bash
pm2 status
pm2 logs ctpred-backend --lines 100
```

### Check System Resources
```bash
htop
df -h
free -m
```

### Check Error Logs
```bash
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
pm2 logs ctpred-backend
```

## Backup & Rollback

### Backup Before Deployment
```bash
# Backup database
mysqldump -u user -p ctpred > ctpred_backup_$(date +%Y%m%d).sql

# Backup frontend files
tar -czf httpdocs_backup_$(date +%Y%m%d).tar.gz httpdocs/

# Backup backend
tar -czf backend_backup_$(date +%Y%m%d).tar.gz CTPREDCORP/backend/
```

### Rollback if Needed
```bash
# Restore previous version
git checkout <previous-commit-hash>

# Rebuild and redeploy
npm run build
cp -r dist/* httpdocs/

# Restart backend
pm2 restart ctpred-backend
```

## Security Checklist

- [ ] `.env` file is not committed to git
- [ ] Database credentials are secure
- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS is enabled (SSL certificate)
- [ ] CORS origins are limited to your domain
- [ ] API rate limiting is configured (optional)
- [ ] Database backups are automated
- [ ] Server firewall is configured
- [ ] Node.js and dependencies are up to date

## Success Indicators

✅ Backend health check returns 200 OK
✅ Frontend loads without errors
✅ Appointment form submits successfully
✅ Admin panel login works
✅ No CORS errors in browser console
✅ Database queries execute properly
✅ Emails are sent (if SMTP configured)

## Support

If issues persist:
1. Check all logs: `pm2 logs`, Apache/Nginx logs
2. Verify environment variables
3. Test API endpoints directly with curl
4. Check browser Network tab for failed requests
5. Ensure database is accessible

---

**Deployment Date:** $(date)
**Backend Port:** 5000
**Environment:** Production
**Frontend:** Static files in httpdocs/
**Backend:** Node.js + Express + MySQL

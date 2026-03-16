# Production Deployment Guide

## Current Issue

Your production site `https://ctpred.com.ph` is returning:

```
Error ID: 23054db0
Web application could not be started by the Phusion Passenger(R) application server.
```

This means your Node.js backend isn't starting on the server.

## Production Server Architecture

Your setup uses:
- **Frontend**: React app (static files served by Apache/Nginx)
- **Backend**: Node.js Express API (should run via Phusion Passenger)
- **Database**: MySQL
- **Server**: Apache/Nginx with Phusion Passenger for Node.js

## Steps to Fix Production Backend

### 1. Check Phusion Passenger Logs

SSH into your server and check the logs:

```bash
ssh your_user@ctpred.com.ph

# Check Passenger logs for the error
sudo tail -f /var/log/apache2/error.log
# OR for Nginx
sudo tail -f /var/log/nginx/error.log

# Look for Error ID: 23054db0
```

The logs will show why the backend can't start. Common reasons:
- Missing Node.js modules
- Wrong Node.js version
- Database connection error
- Missing environment variables
- Port already in use

### 2. Check Backend Files Exist

```bash
cd /home/your_user/ctpred.com.ph/backend
# OR wherever your backend is deployed

ls -la
# You should see:
# - server.js
# - package.json
# - node_modules/
# - .env
```

### 3. Check Node.js Version

```bash
node --version
# Should be v18 or higher

npm --version
```

If Node.js is too old, update it:
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 4. Install Backend Dependencies

```bash
cd /home/your_user/ctpred.com.ph/backend
npm install --production
```

### 5. Check Environment Variables

Ensure `backend/.env` exists with production values:

```bash
cat backend/.env
```

Should contain:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ctpredcorp_db
DB_PORT=3306
PORT=5000
NODE_ENV=production
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
```

### 6. Test Backend Manually

Try starting the backend manually:

```bash
cd backend
node server.js
```

If it shows errors, fix them. Common issues:
- **Database connection failed**: Check MySQL credentials
- **Port in use**: Change PORT in .env
- **Module not found**: Run `npm install`

### 7. Configure Phusion Passenger

Create/check `backend/passenger_wsgi.py` or ensure Apache/Nginx is configured for Node.js:

#### For Apache with Passenger:

Create/edit Apache virtual host config:

```apache
<VirtualHost *:443>
    ServerName ctpred.com.ph
    ServerAlias www.ctpred.com.ph
    
    # Frontend static files
    DocumentRoot /home/your_user/ctpred.com.ph/dist
    
    # Backend API via Passenger
    Alias /api /home/your_user/ctpred.com.ph/backend/public
    <Location /api>
        PassengerBaseURI /api
        PassengerAppRoot /home/your_user/ctpred.com.ph/backend
        PassengerAppType node
        PassengerStartupFile server.js
        PassengerNodejs /home/your_user/.nvm/versions/node/v18.x.x/bin/node
    </Location>
    
    <Directory /home/your_user/ctpred.com.ph/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

#### For Nginx with Passenger:

```nginx
server {
    listen 443 ssl http2;
    server_name ctpred.com.ph www.ctpred.com.ph;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend static files
    root /home/your_user/ctpred.com.ph/dist;
    index index.html;
    
    # API Backend via Passenger
    location /api {
        passenger_enabled on;
        passenger_app_root /home/your_user/ctpred.com.ph/backend;
        passenger_app_type node;
        passenger_startup_file server.js;
        passenger_nodejs /home/your_user/.nvm/versions/node/v18.x.x/bin/node;
    }
    
    # Frontend routes (client-side routing)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 8. Restart Web Server

```bash
# For Apache
sudo systemctl restart apache2

# For Nginx
sudo systemctl restart nginx

# Restart Passenger
passenger-config restart-app /home/your_user/ctpred.com.ph/backend
```

### 9. Test Production API

```bash
curl https://ctpred.com.ph/api/health
# Should return: {"status":"OK","message":"CTP RED API is running"}

curl https://ctpred.com.ph/api/buildings
# Should return JSON array of buildings
```

## Alternative: Run Backend as PM2 Process

If Phusion Passenger is too complex, use PM2 instead:

### 1. Install PM2

```bash
npm install -g pm2
```

### 2. Start Backend with PM2

```bash
cd /home/your_user/ctpred.com.ph/backend
pm2 start server.js --name "ctpred-api"
pm2 save
pm2 startup
```

### 3. Configure Nginx as Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name ctpred.com.ph www.ctpred.com.ph;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend static files
    root /home/your_user/ctpred.com.ph/dist;
    index index.html;
    
    # API Backend via PM2 (reverse proxy)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Restart Nginx

```bash
sudo systemctl restart nginx
```

## Deployment Checklist

- [ ] Backend files uploaded to server
- [ ] `npm install` run in backend directory
- [ ] `backend/.env` configured with production values
- [ ] MySQL database running and accessible
- [ ] Database has tables and data
- [ ] Node.js version 18+ installed
- [ ] Phusion Passenger configured OR PM2 running
- [ ] Apache/Nginx configured
- [ ] Web server restarted
- [ ] API health check returns 200 OK
- [ ] Frontend .env has correct production API URL

## Quick Production Test

From your local machine:

```bash
# Test API health
curl https://ctpred.com.ph/api/health

# Test buildings endpoint
curl https://ctpred.com.ph/api/buildings

# If both return JSON, backend is working!
```

## Common Production Issues

### Issue: Node.js version too old
**Solution**: Install Node.js 18+ with nvm

### Issue: npm modules missing
**Solution**: Run `npm install` in backend directory

### Issue: Database connection refused
**Solution**: Check MySQL is running and credentials in `.env`

### Issue: Port 5000 already in use
**Solution**: Change PORT in `backend/.env` or kill process using port

### Issue: Passenger can't find Node.js
**Solution**: Specify full path to node in Passenger config

### Issue: Permission denied
**Solution**: Check file permissions, run `chmod -R 755 backend/`

## Getting More Help

Check Passenger logs for specific error:
```bash
sudo passenger-status
sudo passenger-memory-stats
sudo tail -100 /var/log/apache2/error.log | grep -A 10 "23054db0"
```

The error ID `23054db0` should appear in logs with the exact reason the backend won't start.

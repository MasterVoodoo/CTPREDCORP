# Plesk Deployment Guide for CTP RED CORP

## Prerequisites

- Plesk hosting with Node.js support (Node.js Manager extension installed)
- SSH access to your server (optional but recommended)
- MySQL database access through Plesk
- Domain configured in Plesk

## Deployment Methods

This guide covers **two deployment methods**:

### Method 1: Pre-Built Deployment (Recommended - Simpler)
If you've already built the project locally and committed the `dist` folder to your repository, you can skip the build step on the server.

### Method 2: Build on Server
Build the frontend directly on the Plesk server (requires more setup).

---

# Method 1: Pre-Built Deployment (Simpler)

## Step 1: Build Locally (If Not Already Done)

```bash
# Install dependencies
npm install

# Build for production
npm run build:all
```

This creates a `dist` folder with the compiled frontend.

## Step 2: Push to Repository

```bash
git add .
git commit -m "Build production version"
git push origin main
```

## Step 3: Database Setup

### Create MySQL Database in Plesk

1. Log into Plesk control panel
2. Go to **Databases** → **Add Database**
3. Create database name: `ctpredcorp_db`
4. Create a database user with full privileges
5. Note down the credentials

### Import Database Schema

1. Go to **Databases** → Select your database → **phpMyAdmin**
2. Click **Import** tab
3. Upload `backend/database/schema.sql` from the repository
4. Click **Go** to execute

### Change Default Admin Password

**IMPORTANT**: The default super admin credentials are:
- Username: `superadmin`
- Email: `admin@ctpredcorp.com`
- Password: `Admin123!`

**Change this immediately after first login!**

## Step 4: Deploy Frontend (Simple Method)

### Option A: Direct Download from GitHub

1. Download the repository as ZIP from GitHub
2. Extract the `dist` folder
3. Connect to Plesk via FTP/SFTP or use File Manager
4. Navigate to your domain's `httpdocs` folder
5. Upload all contents from the `dist` folder to `httpdocs`
6. Upload `public/.htaccess` to the root of `httpdocs`

### Option B: Git Clone on Server

If you have SSH access:

```bash
# SSH into your server
ssh user@yourserver.com

# Navigate to temp directory
cd /tmp

# Clone repository
git clone https://github.com/MasterVoodoo/CTPREDCORP.git

# Copy dist files to httpdocs
cp -r CTPREDCORP/dist/* /var/www/vhosts/yourdomain.com/httpdocs/

# Copy .htaccess
cp CTPREDCORP/public/.htaccess /var/www/vhosts/yourdomain.com/httpdocs/

# Clean up
rm -rf /tmp/CTPREDCORP
```

### File Structure in httpdocs

```
httpdocs/
├── .htaccess
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── vendor-[hash].js
│   ├── ui-[hash].js
│   └── ...
└── [other static files]
```

## Step 5: Deploy Backend

### Upload Backend Files

1. Create a folder outside httpdocs: `/var/www/vhosts/yourdomain.com/backend`
2. Upload all files from the `backend` folder (do NOT upload `node_modules`)
3. You can use FTP, File Manager, or git clone

### Configure Environment Variables

1. In the `backend` folder, create `.env` file
2. Copy content from `.env.production` and update:

```bash
DB_HOST=localhost
DB_USER=your_plesk_db_user
DB_PASSWORD=your_plesk_db_password
DB_NAME=ctpredcorp_db
DB_PORT=3306

PORT=5000
NODE_ENV=production

JWT_SECRET=generate_a_secure_random_string_here
CLIENT_URL=https://yourdomain.com
```

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Install Node.js Dependencies

SSH into your server:

```bash
cd /var/www/vhosts/yourdomain.com/backend
npm install --production
```

### Setup Super Admin (Optional)

Create a custom super admin:

```bash
npm run setup-admin
```

### Create Logs Directory

```bash
mkdir -p /var/www/vhosts/yourdomain.com/backend/logs
chmod 755 /var/www/vhosts/yourdomain.com/backend/logs
```

## Step 6: Configure Node.js in Plesk

### Using Plesk Node.js Manager

1. Go to your domain → **Node.js**
2. Click **Enable Node.js**
3. Configure:
   - **Node.js version**: Select latest LTS (18.x or 20.x)
   - **Document root**: `/httpdocs`
   - **Application root**: `/backend`
   - **Application startup file**: `server.js`
   - **Application mode**: Production

4. Set environment variables in Plesk Node.js interface:
   - Copy all variables from your `.env` file
   - Add each as a separate environment variable

5. Click **Enable Node.js** and **Restart App**

### Alternative: Using PM2

```bash
cd /var/www/vhosts/yourdomain.com/backend

# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## Step 7: Configure Reverse Proxy

1. Go to **Apache & Nginx Settings**
2. Add to **Additional nginx directives**:

```nginx
location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 90;
}
```

3. Click **OK** and restart nginx

## Step 8: Configure SSL Certificate

1. Go to **SSL/TLS Certificates**
2. Click **Install** or use Let's Encrypt
3. Enable **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
4. Update `CLIENT_URL` in backend `.env` to use `https://`
5. Restart the Node.js application

## Step 9: Testing

### Test Frontend

1. Visit `https://yourdomain.com`
2. Check that the main website loads
3. Visit `https://yourdomain.com/admin`
4. Verify admin login page appears

### Test Backend API

```bash
curl -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Admin123!"}'
```

### Test Admin Portal

1. Login with default credentials (change immediately!)
2. Navigate through dashboard, content management, and user management
3. Test creating/editing content
4. Verify all routes work correctly

## Step 10: Post-Deployment Security

1. **Change default admin password immediately**
2. **Set file permissions**:
   ```bash
   chmod 644 /var/www/vhosts/yourdomain.com/backend/.env
   chmod 755 /var/www/vhosts/yourdomain.com/backend
   ```
3. **Disable directory listing** (add to .htaccess):
   ```apache
   Options -Indexes
   ```
4. **Configure firewall** to only allow necessary ports
5. **Regular backups**: Setup automated backups in Plesk

---

# Method 2: Build on Server

## Step 1: Install Build Tools on Server

```bash
# SSH into your server
ssh user@yourserver.com

# Navigate to a build directory
cd /var/www/vhosts/yourdomain.com

# Clone repository
git clone https://github.com/MasterVoodoo/CTPREDCORP.git
cd CTPREDCORP

# Install dependencies
npm install

# Build frontend
npm run build
```

## Step 2: Deploy Built Files

```bash
# Copy dist files to httpdocs
cp -r dist/* /var/www/vhosts/yourdomain.com/httpdocs/

# Copy .htaccess
cp public/.htaccess /var/www/vhosts/yourdomain.com/httpdocs/
```

## Step 3-10: Follow Same Steps as Method 1

Continue with Steps 3-10 from Method 1 above (Database Setup through Post-Deployment Security).

---

## Updating the Application

### For Pre-Built Method (Method 1)

1. **Build locally:**
   ```bash
   npm run build:all
   git add .
   git commit -m "Update production build"
   git push origin main
   ```

2. **Deploy to server:**
   - Download new `dist` folder from repository
   - Upload to `httpdocs` (overwrite existing files)
   - Or use git pull if you cloned on server

3. **Update backend (if needed):**
   ```bash
   cd /var/www/vhosts/yourdomain.com/backend
   git pull origin main
   npm install --production
   pm2 restart ctpredcorp-backend
   ```

### For Build on Server Method (Method 2)

```bash
cd /var/www/vhosts/yourdomain.com/CTPREDCORP
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/vhosts/yourdomain.com/httpdocs/
pm2 restart ctpredcorp-backend
```

## Troubleshooting

### Frontend Issues

**Problem**: 404 errors on page refresh
- **Solution**: Ensure `.htaccess` is uploaded and `mod_rewrite` is enabled

**Problem**: Admin page not loading
- **Solution**: Clear browser cache, check that assets are loading correctly

### Backend Issues

**Problem**: Cannot connect to database
- **Solution**: Verify database credentials in `.env`, check MySQL connection

**Problem**: Node.js app not starting
- **Solution**: Check logs in `backend/logs/` or Plesk Node.js interface

**Problem**: CORS errors
- **Solution**: Verify `CLIENT_URL` in `.env` matches your domain exactly

**Problem**: 502 Bad Gateway
- **Solution**: Ensure Node.js app is running, check reverse proxy configuration

### Permission Issues

```bash
# Fix ownership
chown -R username:psacln /var/www/vhosts/yourdomain.com/backend

# Fix directory permissions
find /var/www/vhosts/yourdomain.com/backend -type d -exec chmod 755 {} \;

# Fix file permissions
find /var/www/vhosts/yourdomain.com/backend -type f -exec chmod 644 {} \;
```

## Maintenance

### Database Backups

1. Use Plesk **Backup Manager**
2. Schedule automatic daily backups
3. Store backups offsite

### Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ctpredcorp-backend

# Monitor resources
pm2 monit
```

- Setup uptime monitoring (e.g., UptimeRobot)
- Review admin activity logs through admin portal
- Monitor server resources in Plesk

## Support

For issues specific to:
- **Plesk**: Contact your hosting provider
- **Application**: Review application logs and GitHub repository
- **Database**: Check MySQL error logs in Plesk

---

## Deployment Checklist

### Pre-Built Method (Recommended)
- [ ] Build completed locally (`npm run build:all`)
- [ ] Database created and schema imported
- [ ] `dist` folder uploaded to httpdocs
- [ ] `.htaccess` configured in httpdocs root
- [ ] Backend uploaded outside httpdocs
- [ ] `.env` configured with production values
- [ ] Node.js dependencies installed (`npm install --production`)
- [ ] Node.js app enabled in Plesk or PM2
- [ ] Reverse proxy configured for /api/
- [ ] SSL certificate installed and HTTPS enabled
- [ ] Default admin password changed
- [ ] File permissions set correctly
- [ ] All routes tested and working
- [ ] Backups configured
- [ ] Monitoring setup

**Your application should now be live and ready for production use!**
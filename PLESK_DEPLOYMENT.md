# Plesk Deployment Guide for CTP RED CORP

## Prerequisites

- Plesk hosting with Node.js support (Node.js Manager extension installed)
- SSH access to your server
- MySQL database access through Plesk
- Domain configured in Plesk

## Step 1: Prepare Your Local Environment

### Build the Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with both the main website and admin portal.

## Step 2: Database Setup

### Create MySQL Database in Plesk

1. Log into Plesk control panel
2. Go to **Databases** → **Add Database**
3. Create database name: `ctpredcorp_db`
4. Create a database user with full privileges
5. Note down the credentials

### Import Database Schema

1. Go to **Databases** → Select your database → **phpMyAdmin**
2. Click **Import** tab
3. Upload `backend/database/schema.sql`
4. Click **Go** to execute

### Change Default Admin Password

**IMPORTANT**: The default super admin credentials are:
- Username: `superadmin`
- Email: `admin@ctpredcorp.com`
- Password: `Admin123!`

**Change this immediately after first login!**

Alternatively, run the setup script (see Backend Setup section).

## Step 3: Deploy Frontend to Plesk

### Upload Files

1. Connect via FTP/SFTP or use Plesk File Manager
2. Navigate to your domain's `httpdocs` folder
3. Upload all contents from the `dist` folder
4. Ensure `.htaccess` file from `public/.htaccess` is in the root

### File Structure in httpdocs

```
httpdocs/
├── .htaccess
├── index.html
├── admin/
│   └── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── [other static files]
```

### Configure Apache (if needed)

1. Go to **Apache & Nginx Settings** for your domain
2. Ensure `mod_rewrite` is enabled
3. Add this to additional directives if .htaccess doesn't work:

```apache
<Directory /var/www/vhosts/yourdomain.com/httpdocs>
    AllowOverride All
</Directory>
```

## Step 4: Deploy Backend to Plesk

### Upload Backend Files

1. Create a folder outside httpdocs: `/var/www/vhosts/yourdomain.com/backend`
2. Upload all files from `backend` folder
3. Do NOT upload `node_modules` folder

### Configure Environment Variables

1. Copy `.env.production` to `.env`
2. Update with your actual credentials:

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

If you want to create a custom super admin instead of using the default:

```bash
npm run setup-admin
```

Follow the prompts to create your admin account.

### Create Logs Directory

```bash
mkdir -p /var/www/vhosts/yourdomain.com/backend/logs
chmod 755 /var/www/vhosts/yourdomain.com/backend/logs
```

## Step 5: Configure Node.js in Plesk

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

If Plesk Node.js Manager is limited, use PM2:

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

## Step 6: Configure Reverse Proxy

### Setup API Proxy in Plesk

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

## Step 7: Configure SSL Certificate

1. Go to **SSL/TLS Certificates**
2. Click **Install** or use Let's Encrypt
3. Enable **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
4. Update `CLIENT_URL` in backend `.env` to use `https://`
5. Restart the Node.js application

## Step 8: Testing

### Test Frontend

1. Visit `https://yourdomain.com`
2. Check that the main website loads
3. Visit `https://yourdomain.com/admin`
4. Verify admin login page appears

### Test Backend API

```bash
# Test health endpoint (create one if needed)
curl https://yourdomain.com/api/health

# Test admin login
curl -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Admin123!"}'
```

### Test Admin Portal

1. Login with default credentials (change immediately!)
2. Navigate through dashboard, content management, and user management
3. Test creating/editing content
4. Verify all routes work correctly

## Step 9: Post-Deployment Security

### Essential Security Steps

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
5. **Enable fail2ban** for SSH and login attempts
6. **Regular backups**: Setup automated backups in Plesk

### Monitor Application

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ctpredcorp-backend

# Monitor resources
pm2 monit
```

## Troubleshooting

### Frontend Issues

**Problem**: 404 errors on page refresh
- **Solution**: Ensure `.htaccess` is uploaded and `mod_rewrite` is enabled

**Problem**: Admin routes not working
- **Solution**: Check that `admin/index.html` exists in the dist folder

### Backend Issues

**Problem**: Cannot connect to database
- **Solution**: Verify database credentials in `.env`, check if MySQL allows connections from localhost

**Problem**: Node.js app not starting
- **Solution**: Check logs in Plesk Node.js interface or `backend/logs/`

**Problem**: CORS errors
- **Solution**: Verify `CLIENT_URL` in `.env` matches your domain exactly

**Problem**: 502 Bad Gateway
- **Solution**: Ensure Node.js app is running and reverse proxy is configured correctly

### Permission Issues

```bash
# Fix ownership
chown -R username:psacln /var/www/vhosts/yourdomain.com/backend

# Fix directory permissions
find /var/www/vhosts/yourdomain.com/backend -type d -exec chmod 755 {} \;

# Fix file permissions
find /var/www/vhosts/yourdomain.com/backend -type f -exec chmod 644 {} \;

# Make server.js executable
chmod 755 /var/www/vhosts/yourdomain.com/backend/server.js
```

## Maintenance

### Updating the Application

1. Build new version locally: `npm run build`
2. Backup current production files
3. Upload new dist files
4. If backend changes:
   - Upload new backend files
   - Run `npm install` if dependencies changed
   - Restart Node.js app: `pm2 restart ctpredcorp-backend`

### Database Backups

1. Use Plesk **Backup Manager**
2. Schedule automatic daily backups
3. Store backups offsite

### Monitoring

- Check application logs regularly
- Monitor server resources in Plesk
- Setup uptime monitoring (e.g., UptimeRobot)
- Review admin activity logs through admin portal

## Support

For issues specific to:
- **Plesk**: Contact your hosting provider
- **Application**: Review application logs and GitHub repository
- **Database**: Check MySQL error logs in Plesk

---

**Deployment Checklist:**

- [ ] Database created and schema imported
- [ ] Frontend built and uploaded to httpdocs
- [ ] .htaccess configured for React Router
- [ ] Backend uploaded outside httpdocs
- [ ] .env configured with production values
- [ ] Node.js dependencies installed
- [ ] Node.js app enabled in Plesk or PM2
- [ ] Reverse proxy configured for /api/
- [ ] SSL certificate installed and HTTPS enabled
- [ ] Default admin password changed
- [ ] File permissions set correctly
- [ ] All routes tested and working
- [ ] Backups configured
- [ ] Monitoring setup

**Your application should now be live and ready for production use!**
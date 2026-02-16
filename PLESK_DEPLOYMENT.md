# Plesk Deployment Guide for CTP RED CORP

## Prerequisites

- Plesk hosting with Node.js support (Node.js Manager extension installed)
- MySQL database access through Plesk
- Domain configured in Plesk
- FTP/SFTP client (FileZilla, WinSCP, etc.) OR use Plesk File Manager

**Note:** This guide does NOT require SSH access - everything can be done through Plesk's web interface.

## Deployment Method: Pre-Built Upload

Since you've already built the project locally and the `dist` folder is in your repository, deployment is simple - just upload the files!

---

## Step 1: Database Setup

### Create MySQL Database in Plesk

1. Log into Plesk control panel
2. Go to **Databases** → **Add Database**
3. Create database name: `ctpredcorp_db`
4. Create a database user with full privileges
5. **Write down these credentials** (you'll need them later):
   - Database name
   - Database user
   - Database password
   - Database host (usually `localhost`)

### Import Database Schema

1. In Plesk, go to **Databases** → Select your database → **phpMyAdmin**
2. Once phpMyAdmin opens, click the **Import** tab
3. Click **Choose File** and upload `backend/database/schema.sql` from your local repository
4. Scroll down and click **Go** to execute
5. You should see a success message and new tables created

### Default Admin Credentials

**IMPORTANT**: After importing, a default super admin is created:
- Username: `superadmin`
- Email: `admin@ctpredcorp.com`
- Password: `Admin123!`

**⚠️ Change this password immediately after first login!**

---

## Step 2: Deploy Frontend Files

### Using Plesk File Manager (Easiest)

1. In Plesk, go to **Files** → **File Manager**
2. Navigate to `httpdocs` folder (this is your web root)
3. **Delete default files** in httpdocs (like `index.html`, if any)
4. Click **Upload** button
5. Upload ALL files and folders from your local `dist` folder:
   - `index.html`
   - `assets` folder (with all contents)
   - `vite.svg` or any other static files
   - All other files in the dist folder

6. Upload the `.htaccess` file:
   - Go to your local `public/.htaccess` file
   - Upload it to the root of `httpdocs`

### Using FTP/SFTP Client (Alternative)

1. Get FTP credentials from Plesk:
   - Go to **Websites & Domains** → your domain → **FTP Access**
   - Note the FTP server, username, and password

2. Connect using FileZilla or WinSCP:
   - Host: Your FTP server address
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (FTP) or 22 (SFTP)

3. Navigate to `httpdocs` folder
4. Delete default files
5. Upload all contents from your local `dist` folder
6. Upload `public/.htaccess` to the root of `httpdocs`

### Expected File Structure in httpdocs

```
httpdocs/
├── .htaccess           ← Important!
├── index.html
├── vite.svg
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── vendor-[hash].js
│   ├── ui-[hash].js
│   └── [other files]
└── [any other static files]
```

### Configure Apache (If .htaccess doesn't work)

1. Go to **Apache & Nginx Settings** for your domain
2. Enable **Allow directory (htaccess) override**
3. If still not working, add to **Additional Apache directives**:

```apache
<Directory /var/www/vhosts/yourdomain.com/httpdocs>
    AllowOverride All
    Options -Indexes
</Directory>
```

---

## Step 3: Deploy Backend Files

### Create Backend Directory

1. In Plesk **File Manager**, navigate UP one level from `httpdocs`
2. You should see folders like: `httpdocs`, `httpsdocs`, `logs`, etc.
3. Click **+ Create Directory**
4. Name it: `backend`
5. Open the `backend` folder

### Upload Backend Files

1. Using **File Manager** or **FTP**, upload ALL files from your local `backend` folder to the `backend` directory in Plesk:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `ecosystem.config.js`
   - `.env.production`
   - `config` folder
   - `database` folder
   - `routes` folder
   - `scripts` folder
   - All other backend files and folders

2. **DO NOT upload `node_modules` folder** (it's huge and will be installed automatically)

### Create .env File

1. In the `backend` folder, locate `.env.production`
2. **Using File Manager:**
   - Right-click `.env.production` → **Copy**
   - Paste it in the same folder
   - Rename the copy to `.env`
   - Right-click `.env` → **Edit in Text Editor**

3. **Update these values:**

```bash
# Use the database credentials from Step 1
DB_HOST=localhost
DB_USER=your_actual_db_user
DB_PASSWORD=your_actual_db_password
DB_NAME=ctpredcorp_db
DB_PORT=3306

PORT=5000
NODE_ENV=production

# Generate a random string for JWT (at least 32 characters)
# Use an online generator or random password generator
JWT_SECRET=paste_a_long_random_string_here_at_least_32_chars

# Your actual domain with https://
CLIENT_URL=https://yourdomain.com
```

4. **Save** the file

**Important:** For `JWT_SECRET`, use a secure random string. You can generate one at: https://randomkeygen.com/ (use the "CodeIgniter Encryption Keys" option)

### Create Logs Directory

1. Inside the `backend` folder, click **+ Create Directory**
2. Name it: `logs`
3. This folder will store application logs

---

## Step 4: Configure Node.js in Plesk

### Install Node.js Dependencies

1. Go to your domain → **Node.js**
2. If not enabled, click **Enable Node.js**
3. Configure:
   - **Node.js version**: Select latest LTS (18.x, 20.x, or 22.x)
   - **Document root**: `/httpdocs`
   - **Application root**: `/backend`
   - **Application startup file**: `server.js`
   - **Application mode**: **Production**
   - **Package manager**: npm

4. **Environment Variables** - Add these (click Add Variable for each):
   - Copy ALL variables from your `backend/.env` file
   - Add each one as: `Variable name` = `Value`
   - Example:
     - `DB_HOST` = `localhost`
     - `DB_USER` = `your_db_user`
     - `DB_PASSWORD` = `your_db_password`
     - etc.

5. Click **NPM Install** button (this installs all dependencies automatically)
6. Wait for installation to complete (may take 2-5 minutes)
7. Click **Enable Node.js** button
8. Click **Restart App** button

### Verify Backend is Running

1. In the Node.js section, check the status - it should show "Running"
2. If there are errors, click **Show Log** to see what went wrong
3. Common issues:
   - Database connection errors (check credentials)
   - Missing environment variables
   - Port already in use

---

## Step 5: Configure Reverse Proxy for API

This allows your frontend to communicate with the backend API.

1. Go to **Apache & Nginx Settings** for your domain
2. Scroll to **Additional nginx directives**
3. Add this code:

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

4. Click **OK** (nginx will automatically restart)

---

## Step 6: Configure SSL Certificate

1. Go to **SSL/TLS Certificates** for your domain
2. If you don't have a certificate:
   - Click **Install a free basic certificate provided by Let's Encrypt**
   - Follow the prompts
   - Wait for installation (1-2 minutes)

3. After SSL is installed:
   - Enable **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
   - This forces all traffic to use HTTPS

4. **Update Backend .env:**
   - Go back to **File Manager** → `backend/.env`
   - Change `CLIENT_URL` to `https://yourdomain.com` (with https)
   - Save the file

5. **Restart Node.js:**
   - Go to **Node.js** section
   - Click **Restart App**

---

## Step 7: Testing Your Deployment

### Test Main Website

1. Open your browser
2. Visit `https://yourdomain.com`
3. The main website should load
4. Check browser console for errors (F12 → Console)

### Test Admin Portal

1. Visit `https://yourdomain.com/admin`
2. You should see the admin login page
3. Try logging in with default credentials:
   - Username: `superadmin`
   - Password: `Admin123!`

4. If login works:
   - ✅ Database connection is working
   - ✅ Backend API is working
   - ✅ Frontend-backend communication is working

5. **IMMEDIATELY change the default password:**
   - Go to User Management
   - Edit superadmin user
   - Change password to something secure

### Common Issues and Solutions

**Problem:** 404 errors on page refresh or admin routes
- **Solution:** Check that `.htaccess` is in `httpdocs` root
- Go to **Apache & Nginx Settings** → Enable **Allow directory (htaccess) override**

**Problem:** Admin login shows "Network Error" or "Cannot connect"
- **Solution:** Backend not running or reverse proxy not configured
- Check Node.js status in Plesk
- Verify reverse proxy configuration in nginx directives
- Check backend logs (Node.js section → Show Log)

**Problem:** Login says "Invalid credentials" even with correct password
- **Solution:** Database not imported correctly
- Re-import `backend/database/schema.sql` in phpMyAdmin
- Check database name in `.env` matches actual database

**Problem:** Page loads but styles are broken
- **Solution:** Assets not loading correctly
- Check that all files in `dist/assets` folder were uploaded
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for 404 errors

**Problem:** CORS errors in browser console
- **Solution:** `CLIENT_URL` mismatch
- Verify `CLIENT_URL` in backend `.env` matches your domain exactly
- Must include `https://` and NO trailing slash
- Restart Node.js app after changing

---

## Step 8: Post-Deployment Security

### Essential Security Checklist

- [ ] **Changed default admin password** (`Admin123!` → strong password)
- [ ] **SSL certificate installed** and HTTPS redirect enabled
- [ ] **`.env` file permissions** - ensure it's not publicly accessible (Plesk handles this automatically outside httpdocs)
- [ ] **Directory listing disabled** - add `Options -Indexes` to `.htaccess`
- [ ] **Regular backups configured** (see below)

### Setup Automated Backups

1. Go to **Backup Manager** in Plesk
2. Click **Schedule a Backup**
3. Configure:
   - **Backup type**: Full backup
   - **Schedule**: Daily at 2:00 AM (or your preference)
   - **Store backups**: On server + external storage (if available)
   - **Number of backups to keep**: 7 (one week)

4. Click **OK**

---

## Maintenance & Updates

### How to Update the Application

1. **Build new version locally:**
   ```bash
   npm run build:all
   git add .
   git commit -m "Update production version"
   git push origin main
   ```

2. **Backup current production:**
   - Download current `httpdocs` and `backend` folders as backup
   - Or create manual backup in Plesk Backup Manager

3. **Update frontend:**
   - Download new repository ZIP from GitHub
   - Extract and get the `dist` folder
   - Use File Manager or FTP to upload/overwrite files in `httpdocs`

4. **Update backend (if changes were made):**
   - Upload new/changed backend files
   - If `package.json` changed, reinstall dependencies:
     - Go to Node.js section
     - Click **NPM Install**
   - Click **Restart App**

### Monitoring Your Application

1. **Check Node.js Status:**
   - Go to **Node.js** section regularly
   - Ensure status shows "Running"
   - Click **Show Log** to check for errors

2. **Monitor Database Size:**
   - Go to **Databases** → select your database
   - Check size regularly
   - Clean old logs if needed

3. **Review Admin Activity:**
   - Log into admin portal
   - Check activity logs for suspicious activity

4. **Setup Uptime Monitoring:**
   - Use free service like UptimeRobot (uptimerobot.com)
   - Monitor both `https://yourdomain.com` and `https://yourdomain.com/admin`

---

## Troubleshooting Guide

### Node.js Application Won't Start

1. Check Node.js logs:
   - Go to **Node.js** → **Show Log**
   - Look for error messages

2. Common errors:
   - **Port already in use**: Change `PORT=5000` to `PORT=5001` in environment variables
   - **Cannot connect to database**: Check database credentials
   - **Module not found**: Click **NPM Install** to reinstall dependencies

### Frontend Not Loading

1. Check that files were uploaded:
   - File Manager → `httpdocs` → should see `index.html` and `assets` folder

2. Check `.htaccess`:
   - Should be in `httpdocs` root
   - Enable htaccess override in Apache settings

3. Check browser console (F12) for errors

### Database Connection Issues

1. Verify database exists:
   - Go to **Databases** → should see `ctpredcorp_db`

2. Check credentials:
   - Database user has full privileges
   - Password is correct in `.env` file
   - Database host is `localhost`

3. Test connection in phpMyAdmin:
   - If you can access phpMyAdmin with same credentials, connection is working

---

## Complete Deployment Checklist

### Database Setup
- [ ] MySQL database created (`ctpredcorp_db`)
- [ ] Database user created with full privileges
- [ ] Schema imported (`backend/database/schema.sql`)
- [ ] Default admin credentials noted

### Frontend Deployment
- [ ] All `dist` folder contents uploaded to `httpdocs`
- [ ] `.htaccess` file uploaded to `httpdocs` root
- [ ] Directory override enabled in Apache settings
- [ ] Main website loads at `https://yourdomain.com`

### Backend Deployment
- [ ] `backend` folder created outside `httpdocs`
- [ ] All backend files uploaded (except `node_modules`)
- [ ] `.env` file created with correct credentials
- [ ] `logs` directory created
- [ ] Node.js enabled and configured
- [ ] Environment variables set in Plesk Node.js
- [ ] Dependencies installed (`NPM Install` clicked)
- [ ] Application started and running

### Configuration
- [ ] Reverse proxy configured for `/api/`
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] `CLIENT_URL` updated to use HTTPS

### Testing
- [ ] Main website loads correctly
- [ ] Admin login page loads (`/admin`)
- [ ] Login works with default credentials
- [ ] Default admin password changed
- [ ] All admin features tested

### Security & Maintenance
- [ ] Default password changed
- [ ] Automated backups configured
- [ ] Uptime monitoring setup (optional)
- [ ] File permissions verified

---

## Support Resources

**For Plesk Issues:**
- Plesk documentation: https://docs.plesk.com
- Contact your hosting provider's support

**For Application Issues:**
- Check application logs in Plesk Node.js section
- Review GitHub repository documentation
- Check browser console for frontend errors

**For Database Issues:**
- Access phpMyAdmin for direct database management
- Check MySQL error logs in Plesk

---

**🎉 Congratulations! Your CTP RED CORP application should now be live and ready for production use!**
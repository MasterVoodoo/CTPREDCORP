# Admin System Setup Guide

This guide will help you set up the secure admin authentication system for CTP RED CORP.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Dependencies](#backend-dependencies)
4. [Environment Configuration](#environment-configuration)
5. [Create Super Admin](#create-super-admin)
6. [Frontend Routes](#frontend-routes)
7. [Testing](#testing)
8. [Security Features](#security-features)

---

## Prerequisites

Before starting, ensure you have:

- MySQL/MariaDB running (via XAMPP or standalone)
- Node.js and npm installed
- Backend server set up and running
- Frontend development server running

---

## Database Setup

### 1. Run the Admin Schema

Execute the admin schema SQL file in your MySQL database:

```bash
# Option 1: Using MySQL command line
mysql -u root -p ctpredcorp_db < backend/database/admin_schema.sql

# Option 2: Using phpMyAdmin
# - Open http://localhost/phpmyadmin
# - Select ctpredcorp_db database
# - Click "SQL" tab
# - Copy and paste contents of backend/database/admin_schema.sql
# - Click "Go"
```

This creates three tables:
- `admin_users` - Admin accounts with role-based access
- `admin_login_logs` - Track login attempts and security
- `admin_activity_logs` - Audit trail of admin actions

---

## Backend Dependencies

### Install Required Packages

```bash
cd backend
npm install bcrypt jsonwebtoken
```

**Packages:**
- `bcrypt` - Secure password hashing
- `jsonwebtoken` - JWT authentication tokens

### Update server.js

Add the admin routes to your `backend/server.js`:

```javascript
// Import admin routes
const adminRoutes = require('./routes/admin');

// Use admin routes
app.use('/api/admin', adminRoutes);
```

---

## Environment Configuration

### Create/Update .env file

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ctpredcorp_db

# JWT Secret (CHANGE THIS TO A STRONG RANDOM STRING)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this

# Server Configuration
PORT=5000
```

**Important:** Generate a strong JWT secret:

```bash
# Generate a secure random string (Linux/Mac)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Create Super Admin

### Run the Setup Script

Execute the super admin setup script:

```bash
cd backend
node scripts/setupSuperAdmin.js
```

### Follow the Prompts

```
=== CTP RED CORP - Super Admin Setup ===

Enter super admin username: superadmin
Enter full name: Administrator
Enter email: admin@ctpred.com.ph

Password must be at least 8 characters long.
Enter password: ********
Confirm password: ********

Connecting to database...
Hashing password...
Creating super admin account...

✅ Super admin account created successfully!

=== Account Details ===
ID: 1
Username: superadmin
Email: admin@ctpred.com.ph
Full Name: Administrator
Role: super_admin

⚠️  IMPORTANT: Please keep your credentials secure!
You can now log in at: http://localhost:5173/admin/login
```

---

## Frontend Routes

### Access Admin Pages

The admin system uses these routes:

1. **Admin Login**
   - URL: `http://localhost:5173/#admin-login`
   - Component: `src/pages/AdminLogin.tsx`
   - Public access (no authentication required)

2. **Admin Dashboard**
   - URL: `http://localhost:5173/#admin-dashboard`
   - Component: `src/pages/AdminDashboard.tsx`
   - Requires authentication
   - Super Admin sees all features
   - Regular Admin sees limited features

### Update App.tsx Routes

Add these route handlers to `src/App.tsx`:

```typescript
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Inside your routing logic:
if (currentPage === "admin-login") {
  return <AdminLogin />;
}

if (currentPage === "admin-dashboard") {
  return <AdminDashboard />;
}
```

---

## Testing

### 1. Test Admin Login

```bash
# Start backend server
cd backend
node server.js

# In a new terminal, start frontend
cd ..
npm run dev
```

Navigate to: `http://localhost:5173/#admin-login`

Login with your super admin credentials.

### 2. Test API Endpoints

Using curl or Postman:

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"your-password"}'

# Verify Token (replace YOUR_TOKEN)
curl http://localhost:5000/api/admin/verify \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get All Admins (Super Admin only)
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Security Features

### Authentication & Authorization

✅ **JWT-based authentication**
- Tokens expire after 24 hours
- Stored in localStorage
- Automatically validated on protected routes

✅ **Role-based access control**
- **Super Admin**: Full system access, can manage all admins
- **Admin**: Limited access, cannot manage other admins

✅ **Password security**
- Bcrypt hashing with cost factor 10
- Minimum 8 characters
- Never stored in plain text

✅ **Activity logging**
- All admin actions logged
- Login attempts tracked
- IP addresses recorded
- Audit trail for compliance

### Protected Actions

**Super Admin Only:**
- Create new admin accounts
- Edit admin accounts
- Delete admin accounts
- View all admin users
- Access user management panel

**All Admins:**
- View dashboard
- Change own password
- View activity logs
- Access content management (coming soon)

### Security Best Practices

1. **Change JWT Secret**
   - Use a strong random string (32+ characters)
   - Never commit the secret to version control
   - Rotate periodically

2. **Password Policy**
   - Minimum 8 characters
   - Encourage strong passwords with numbers and symbols
   - Consider implementing password expiration

3. **Session Management**
   - Tokens expire after 24 hours
   - Users must re-login after expiration
   - Logout clears local storage

4. **Database Security**
   - Use environment variables for credentials
   - Limit database user permissions
   - Regular backups

---

## API Endpoints Reference

### Public Endpoints

```
POST /api/admin/login
Body: { username, password }
Response: { token, user }
```

### Protected Endpoints (Require Authorization Header)

```
GET /api/admin/verify
Response: { success: true, user }

POST /api/admin/logout
Response: { success: true, message }

PUT /api/admin/change-password
Body: { currentPassword, newPassword }
Response: { success: true, message }

GET /api/admin/logs/activity?limit=100&offset=0
Response: { success: true, logs }

GET /api/admin/logs/login?limit=100&offset=0
Response: { success: true, logs }
```

### Super Admin Only Endpoints

```
GET /api/admin/users
Response: { success: true, admins }

POST /api/admin/users
Body: { username, email, password, fullName, role }
Response: { success: true, adminId }

PUT /api/admin/users/:id
Body: { email, fullName, role, isActive }
Response: { success: true, message }

DELETE /api/admin/users/:id
Response: { success: true, message }
```

---

## Troubleshooting

### Common Issues

**1. "Cannot connect to database"**
- Check XAMPP/MySQL is running
- Verify database credentials in `.env`
- Ensure `ctpredcorp_db` database exists

**2. "Invalid or expired token"**
- Token expired (24h limit)
- JWT secret mismatch
- Clear localStorage and login again

**3. "Failed to fetch admins"**
- Not logged in as super admin
- Check backend server is running
- Verify API endpoint in frontend code

**4. "bcrypt/jsonwebtoken not found"**
```bash
cd backend
npm install bcrypt jsonwebtoken
```

---

## Next Steps

1. **Change Default Credentials**
   - Login with super admin
   - Go to User Management
   - Update your password

2. **Create Additional Admins**
   - Navigate to User Management
   - Click "Add Admin"
   - Fill in details and select role

3. **Integrate with CMS**
   - Add content management features
   - Protect data modification routes
   - Use admin authentication middleware

4. **Monitor Activity**
   - Regularly check activity logs
   - Review failed login attempts
   - Audit admin actions

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review backend console logs
- Check browser console for frontend errors
- Verify all dependencies are installed

---

**Security Notice:** This admin system handles sensitive data. Always follow security best practices, use HTTPS in production, and keep your system updated.
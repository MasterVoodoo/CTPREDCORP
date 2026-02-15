# Admin System Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Install Backend Dependencies

```bash
cd backend
npm install bcrypt jsonwebtoken
```

### 2. Run Database Schema

In phpMyAdmin (http://localhost/phpmyadmin):
1. Select `ctpredcorp_db` database
2. Go to SQL tab
3. Copy/paste contents from `backend/database/admin_schema.sql`
4. Click "Go"

### 3. Update Backend Server

Add to `backend/server.js` (before `app.listen`):

```javascript
// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
```

### 4. Create .env File

Create `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ctpredcorp_db
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-long
PORT=5000
```

### 5. Create Super Admin

```bash
cd backend
node scripts/setupSuperAdmin.js
```

Follow the prompts to create your first admin account.

### 6. Start Servers

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd ..
npm run dev
```

## 🔐 Access Admin Portal

- **Login:** http://localhost:5173/#admin-login
- **Dashboard:** http://localhost:5173/#admin-dashboard

## 👥 User Roles

### Super Admin
- Full system access
- Create/edit/delete admin accounts
- View all logs and analytics
- Manage content (coming soon)

### Admin
- View dashboard
- Access analytics
- View logs
- Manage content (coming soon)
- Cannot manage other admin accounts

## 📚 Full Documentation

See `docs/ADMIN_SETUP.md` for:
- Complete setup instructions
- Security features
- API documentation
- Troubleshooting

## 🔑 Default Access

After running the setup script, log in with the credentials you created.

**⚠️ IMPORTANT:**
- Change your password immediately after first login
- Keep JWT_SECRET secure and never commit it
- Use strong passwords (min 8 characters)

## 🎯 What's Included

✅ Secure JWT authentication
✅ Role-based access control
✅ Password hashing with bcrypt
✅ Activity logging and audit trail
✅ Login attempt tracking
✅ User management interface
✅ Responsive admin dashboard

## 🛠 Next Steps

1. Log in to admin portal
2. Create additional admin accounts (Super Admin only)
3. Explore the dashboard
4. Integrate with content management features

---

**Need Help?** Check `docs/ADMIN_SETUP.md` for detailed documentation.
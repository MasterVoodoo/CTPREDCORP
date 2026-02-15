# Admin System Setup Guide

## 🎯 Overview

The admin system is now **completely separated** from the main website using a dedicated `/admin` folder structure with proper routing.

## 📁 Folder Structure

```
CTPREDCORP/
├── admin/                    # Separate admin application
│   ├── index.html           # Admin entry point
│   ├── main.tsx             # Admin root
│   ├── AdminApp.tsx         # Admin router
│   └── pages/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       └── AdminContent.tsx
├── src/                      # Main website
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
└── vite.config.ts           # Multi-page config
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install `react-router-dom` which is required for admin routing.

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access the Applications

- **Main Website**: `http://localhost:5173/`
- **Admin Portal**: `http://localhost:5173/admin/`

## 🔐 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/` or `/admin/login` | Login page |
| `/admin/dashboard` | Main dashboard |
| `/admin/content` | Content management |

## ⚙️ How It Works

### Multi-Page Build System

Vite is configured for multi-page build with two entry points:

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),      // Main site
      admin: path.resolve(__dirname, 'admin/index.html'), // Admin portal
    },
  },
}
```

### React Router Integration

The admin system uses React Router for navigation:

```typescript
// admin/AdminApp.tsx
<BrowserRouter basename="/admin">
  <Routes>
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/dashboard" element={<AdminDashboard />} />
    <Route path="/content" element={<AdminContent />} />
  </Routes>
</BrowserRouter>
```

### Protected Routes

All admin routes are protected with authentication checks:

```typescript
<Route 
  path="/dashboard" 
  element={
    isAuthenticated ? 
      <AdminDashboard /> : 
      <Navigate to="/admin/login" replace />
  } 
/>
```

## 🔒 Security Features

✅ **JWT Authentication** - Token-based auth with verification
✅ **Protected Routes** - Auto-redirect to login if not authenticated
✅ **Session Persistence** - Login state saved in localStorage
✅ **Secure Logout** - Clears all auth data on logout

## 🎨 Features

### Admin Dashboard
- Overview with statistics
- User management (Super Admin only)
- Activity logs
- Quick action buttons

### Content Management
- Edit building details
- Update unit information
- Real-time unsaved changes tracking
- Confirmation dialogs for data loss prevention

### User Management
- Create/edit/delete admin users
- Role management (Admin vs Super Admin)
- Toggle user active status
- View login history

## 🔄 Navigation Flow

```
Main Site (/) ←→ Completely Separated ←→ Admin Portal (/admin)

Admin Flow:
/admin/login
    ↓ (successful login)
/admin/dashboard
    ↓ (manage content)
/admin/content
    ↓ (back button)
/admin/dashboard
    ↓ (logout)
/admin/login
```

## 📝 Important Notes

1. **No Hash Routes**: Admin no longer uses `#admin-login` - it's now `/admin/login`
2. **Complete Separation**: Main site and admin are totally independent
3. **No Back Button Conflicts**: Each system has its own routing
4. **Direct Access**: Can bookmark and directly access `/admin/dashboard`
5. **Clean URLs**: Proper paths instead of hash-based routing

## 🛠️ Development Tips

### Testing Admin Routes

```bash
# Start dev server
npm run dev

# Test routes:
http://localhost:5173/              # Main site
http://localhost:5173/admin         # Auto-redirects to /admin/login
http://localhost:5173/admin/login   # Login page
http://localhost:5173/admin/dashboard # Dashboard (requires auth)
http://localhost:5173/admin/content   # Content manager (requires auth)
```

### Building for Production

```bash
npm run build
```

This creates two separate builds:
- `dist/index.html` - Main website
- `dist/admin/index.html` - Admin portal

## 🔧 Backend Setup

Make sure your backend is running:

```bash
cd backend
node server.js
```

API endpoints:
- `POST /api/admin/login` - Login
- `GET /api/admin/verify` - Verify token
- `POST /api/admin/logout` - Logout
- `GET /api/admin/users` - List admins
- `POST /api/admin/users` - Create admin

## 🚨 Troubleshooting

### Issue: 404 on admin routes

**Solution**: Make sure you're accessing `/admin` not `/#admin`

### Issue: React Router not found

**Solution**: Run `npm install` to install dependencies

### Issue: Admin routes redirect to main site

**Solution**: Clear browser cache and localStorage

### Issue: Can't access dashboard after login

**Solution**: Check backend is running and JWT token is valid

## 📚 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router DOM v6
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Backend**: Node.js + Express + MySQL

## ✅ Checklist

- [x] Separate `/admin` folder structure
- [x] React Router for proper routing
- [x] Multi-page Vite configuration
- [x] JWT authentication
- [x] Protected routes
- [x] No hash-based routing
- [x] Complete isolation from main site
- [x] Clean URLs
- [x] Back button works correctly

---

**Result**: Admin portal is now a completely independent application with proper `/admin` routing! 🎉
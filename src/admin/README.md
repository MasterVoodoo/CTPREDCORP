# Admin System

## Structure

```
src/admin/
├── AdminApp.tsx              # Main admin app with auth
├── pages/
│   ├── AdminLogin.tsx        # Login page
│   └── AdminDashboard.tsx    # Dashboard with tabs
└── components/
    ├── PropertyManagement.tsx # Manage buildings & units
    └── UserManagement.tsx     # Manage admin users
```

## Access

**Development:** `http://localhost:5173/admin`

## Features

### Authentication
- JWT-based login
- Backend: `POST /api/admin/login`
- Token stored in localStorage
- Session verification on load

### Property Management
- View all buildings and units
- Edit unit details (size, price, status, condition)
- Filter by building
- Real-time updates

### User Management (Super Admin Only)
- Create new admin users
- View all admin accounts
- Activate/Deactivate users
- Delete users (except super admin)
- Role-based permissions

## Backend Integration

The admin system connects to these backend endpoints:

```
POST   /api/admin/login       # Login
POST   /api/admin/logout      # Logout
GET    /api/admin/verify      # Verify token
GET    /api/admin/users       # List users (super admin)
POST   /api/admin/users       # Create user (super admin)
PUT    /api/admin/users/:id   # Update user (super admin)
DELETE /api/admin/users/:id   # Delete user (super admin)
GET    /api/buildings         # List buildings
GET    /api/buildings/:id/units # List units
PUT    /api/units/:id         # Update unit
```

## Database Tables

### admin_users
- id, username, email, password_hash
- role (super_admin, admin)
- full_name, is_active
- last_login, created_at, updated_at

### admin_login_logs
- Tracks all login attempts

### admin_activity_logs
- Tracks all admin actions

## Security

✅ No hash-based routing
✅ JWT authentication required
✅ Role-based access control
✅ Token verification on every load
✅ Separate from main app

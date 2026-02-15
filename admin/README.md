# CTP RED CORP - Admin Portal

This is a **separate admin application** that runs independently from the main website.

## 🚀 Access Admin Portal

### Development
Access the admin portal at:
```
http://localhost:5173/admin/
```

### Production
The admin portal will be available at:
```
https://yourdomain.com/admin/
```

## 📁 Structure

```
admin/
├── index.html          # Admin app HTML entry point
├── main.tsx            # Admin app entry point
├── AdminApp.tsx        # Admin routing and state management
└── pages/
    ├── AdminLogin.tsx      # Login page
    └── AdminDashboard.tsx  # Dashboard with tabs
```

## ✨ Features

- **Separate Application**: Not accessible via hash (#) routing from main site
- **Authentication**: Login required with JWT tokens
- **Role-Based Access**: Super Admin and Admin roles
- **Dashboard Tabs**:
  - Overview: Quick stats and actions
  - Financial Reports: View financial data
  - User Management: Super Admin only
  - Activity Logs: Coming soon
- **Content Management**: Access from dashboard to manage buildings/units

## 🔐 Security

- No hash-based routing (prevents accidental access from main site)
- JWT token authentication
- Role-based permissions
- Session verification on every page load

## 🛠️ Development

The admin app shares components from `/src/components/`:
- `AdminPage.tsx` - Content management
- `AdminUserManagement.tsx` - User management
- `FinancialReports.tsx` - Financial reports

## 📝 Notes

- Admin pages are completely separate from the main app
- No `#admin-login` or `#admin-dashboard` hash routes
- Access only via `/admin/` URL path

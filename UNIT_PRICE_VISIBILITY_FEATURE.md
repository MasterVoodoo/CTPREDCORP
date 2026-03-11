# Unit Price Visibility Feature

## Overview
This feature adds a global setting in the admin panel to control the visibility of unit prices across the entire website. When disabled, all unit prices are completely hidden from the public-facing pages.

## Implementation Date
March 9, 2026

## Components Modified

### Backend

#### 1. Database Migration
**File**: `backend/database/migrations/create_settings_table.sql`
- Created `site_settings` table to store global website settings
- Includes columns: `id`, `setting_key`, `setting_value`, `setting_type`, `description`, `updated_at`, `updated_by`
- Default settings inserted:
  - `show_unit_prices`: Controls unit price visibility (default: true)
  - `show_contact_info`: Controls contact information visibility (default: true)
  - `maintenance_mode`: Enables maintenance mode (default: false)

**To run migration:**
```sql
mysql -u [username] -p [database_name] < backend/database/migrations/create_settings_table.sql
```

#### 2. Settings API Routes
**File**: `backend/routes/settings.js`
- `GET /api/settings` - Public endpoint to fetch all settings as key-value pairs
- `GET /api/settings/:key` - Public endpoint to fetch a single setting
- `PUT /api/settings/:key` - Admin endpoint to update a setting
- `GET /api/settings/admin/all` - Admin endpoint to fetch all settings with metadata

**Added to**: `backend/server.js` (line ~93)
```javascript
app.use('/api/settings', settingsRouter);
```

### Frontend

#### 3. Settings Hook
**File**: `src/hooks/useSettings.ts`
- Custom React hook to fetch and cache settings from the API
- Returns: `{ settings, loading, error }`
- Automatically fetches settings on component mount
- Provides default values if API call fails

**Exported in**: `src/hooks/index.ts`

#### 4. Admin Settings Component
**File**: `src/admin/components/SiteSettings.tsx`
- New admin panel page for managing site settings
- Features:
  - Toggle switches for each boolean setting
  - Real-time updates (changes apply immediately)
  - Success/error notifications
  - Last updated timestamp for each setting
  - Informative help text

**Integrated in**:
- `src/admin/components/AdminSidebar.tsx` - Added "Site Settings" menu item
- `src/admin/pages/AdminDashboard.tsx` - Added settings tab rendering

#### 5. UI Components (New)
**Files**:
- `src/components/ui/switch.tsx` - Radix UI Switch component
- `src/components/ui/label.tsx` - Radix UI Label component
- `src/lib/utils.ts` - Utility function for className merging

**Dependencies Added**:
```json
{
  "@radix-ui/react-switch": "^1.1.3",
  "@radix-ui/react-label": "^2.1.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.5"
}
```

#### 6. Modified Components (Price Display)
All components now conditionally render prices based on `settings.show_unit_prices`:

1. **`src/components/UnitDetailsPage.tsx`**
   - Wraps pricing section in conditional: `{settings.show_unit_prices && (...)}`
   - Hides the entire price card when disabled

2. **`src/components/SearchResults.tsx`**
   - Conditionally renders price in unit cards
   - Adds `ml-auto` to "View Details" button when price is hidden

3. **`src/components/DynamicBuildingProperty.tsx`**
   - Conditionally renders price in unit listings
   - Adds `ml-auto` to "View Details" button when price is hidden

4. **`src/components/AllAvailableSpaces.tsx`**
   - Conditionally renders price in available spaces view
   - Adds `ml-auto` to "View Details" button when price is hidden

## How It Works

### Data Flow
1. Admin toggles the "Show Unit Prices" setting in the admin panel
2. Frontend sends `PUT /api/settings/show_unit_prices` with new value
3. Backend updates the database
4. All public pages using `useSettings()` hook automatically fetch the updated setting
5. Components conditionally render prices based on `settings.show_unit_prices`

### Caching
- Settings are fetched once per page load via `useSettings()` hook
- Each component using the hook shares the same fetch request (React's batching)
- No real-time updates (requires page refresh to see changes)

## Usage

### For Administrators

1. **Access Settings**:
   - Log in to admin panel
   - Click "Site Settings" in the sidebar

2. **Toggle Price Visibility**:
   - Find "Show Unit Prices" setting
   - Click the toggle switch
   - Changes apply immediately (users need to refresh)

3. **Verify Changes**:
   - Open the public website in an incognito window
   - Navigate to any property or unit page
   - Verify prices are hidden/shown as expected

### For Developers

**Adding a new setting:**

1. Add to database:
```sql
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
VALUES ('new_setting', 'true', 'boolean', 'Description here');
```

2. Use in components:
```typescript
import { useSettings } from '@/hooks/useSettings';

function MyComponent() {
  const { settings } = useSettings();
  
  return (
    <div>
      {settings.new_setting && <p>Conditional content</p>}
    </div>
  );
}
```

3. Add to admin UI (optional):
   - Edit `src/admin/components/SiteSettings.tsx`
   - Add new setting to the list with appropriate label

## Testing Checklist

- [x] Database migration creates table successfully
- [x] Settings API endpoints return correct data
- [x] Admin panel displays settings correctly
- [x] Toggle switches update database
- [x] Public pages fetch settings on load
- [x] Prices hidden when setting is disabled
- [x] Prices shown when setting is enabled
- [x] Button alignment correct when prices hidden
- [x] No console errors
- [x] Build completes successfully

## Deployment Steps

1. **Database**:
   ```bash
   mysql -u [user] -p [database] < backend/database/migrations/create_settings_table.sql
   ```

2. **Backend**:
   - No additional steps (routes auto-loaded)

3. **Frontend**:
   ```bash
   npm install
   npm run build
   ```

4. **Verify**:
   - Check admin panel → Site Settings
   - Test toggling price visibility
   - Verify on public pages

## Future Enhancements

1. **Real-time Updates**: Use WebSockets or polling to update settings without page refresh
2. **Setting Groups**: Organize settings into categories (Display, Security, etc.)
3. **Setting History**: Track who changed what and when
4. **Validation**: Add server-side validation for setting values
5. **Permissions**: Allow different admin roles to access different settings
6. **Bulk Actions**: Enable/disable multiple settings at once
7. **Export/Import**: Backup and restore settings configuration

## Troubleshooting

### Prices still showing after disabling
- Clear browser cache
- Check database: `SELECT * FROM site_settings WHERE setting_key = 'show_unit_prices';`
- Verify API response: `curl https://ctpred.com.ph/api/settings`

### Settings not loading
- Check browser console for errors
- Verify backend is running: `curl https://ctpred.com.ph/api/health`
- Check database connection

### Toggle not working in admin
- Check browser console for errors
- Verify admin token is valid
- Check backend logs for errors

## Related Files

### Backend
- `backend/database/migrations/create_settings_table.sql`
- `backend/routes/settings.js`
- `backend/server.js`

### Frontend - Admin
- `src/admin/components/SiteSettings.tsx`
- `src/admin/components/AdminSidebar.tsx`
- `src/admin/pages/AdminDashboard.tsx`

### Frontend - Public
- `src/hooks/useSettings.ts`
- `src/hooks/index.ts`
- `src/components/UnitDetailsPage.tsx`
- `src/components/SearchResults.tsx`
- `src/components/DynamicBuildingProperty.tsx`
- `src/components/AllAvailableSpaces.tsx`

### UI Components
- `src/components/ui/switch.tsx`
- `src/components/ui/label.tsx`
- `src/lib/utils.ts`

## API Documentation

### GET /api/settings
Fetch all settings as key-value pairs (public).

**Response:**
```json
{
  "show_unit_prices": true,
  "show_contact_info": true,
  "maintenance_mode": false
}
```

### GET /api/settings/:key
Fetch a single setting (public).

**Response:**
```json
{
  "show_unit_prices": true
}
```

### PUT /api/settings/:key
Update a setting value (admin only).

**Request:**
```json
{
  "value": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Setting updated successfully",
  "key": "show_unit_prices",
  "value": false
}
```

### GET /api/settings/admin/all
Fetch all settings with metadata (admin only).

**Response:**
```json
[
  {
    "id": 1,
    "setting_key": "show_unit_prices",
    "setting_value": "true",
    "setting_type": "boolean",
    "description": "Show or hide unit prices on the website",
    "updated_at": "2026-03-09T10:30:00.000Z",
    "updated_by": null
  }
]
```

---

**Author**: AI Assistant  
**Date**: March 9, 2026  
**Version**: 1.0

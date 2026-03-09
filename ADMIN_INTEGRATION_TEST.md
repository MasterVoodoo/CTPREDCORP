# Admin Integration Testing Guide

This guide will help you verify that the admin panel is properly connected and that changes made in the admin panel are reflected on the website in real-time.

## ✅ Pre-requisites

1. **Backend Running**: `npm run dev:backend` (port 5000)
2. **Frontend Running**: `npm run dev` (port 5173)
3. **Database Setup**: Admin user created via `npm run setup:backend`

## 🔐 Step 1: Test Admin Login

### Access Admin Panel
1. Navigate to: `http://localhost:5173/admin/login`
2. You should see the admin login page with CTP RED CORP branding

### Login
- **Default Credentials** (if you ran setup script):
  - Username: `admin`
  - Password: `admin123` (or whatever you set during setup)

### Expected Behavior
- ✅ Successful login redirects to `/admin` (dashboard)
- ✅ Failed login shows error message
- ✅ Token stored in localStorage
- ❌ Direct access to `/admin` without login redirects to `/admin/login`

## 🏢 Step 2: Test Building Management

### View Buildings
1. In admin dashboard, click "Property Management"
2. You should see a list of all buildings from the database

### Add New Building
1. Click "Add Building" button
2. Fill in the form:
   ```
   Building ID: test-building-001
   Name: Test Building
   Display Name: Test Corporate Center
   Location: 123 Test Street, Test City
   Short Location: Test City
   Description: ["A test building for verification"]
   Hero Image: /path/to/image.jpg
   ```
3. Click "Save"

### Verify on Website
1. Open new tab: `http://localhost:5173/`
2. Scroll to "Featured Office Buildings" section
3. **Expected**: Your new building should appear in the list
4. Click on the building card
5. **Expected**: Building details page loads with your data

### Edit Building
1. Back in admin panel, click "Edit" on your test building
2. Change the name to "Updated Test Building"
3. Click "Save"
4. Refresh the main website
5. **Expected**: Building name is updated

### Delete Building
1. In admin panel, click "Delete" on test building
2. Confirm deletion
3. Refresh the main website
4. **Expected**: Building no longer appears

## 🏠 Step 3: Test Unit Management

### View Units
1. In admin dashboard, go to "Property Management" > "Units" tab
2. You should see all units from all buildings

### Add New Unit
1. Click "Add Unit" button
2. Fill in the form:
   ```
   Unit ID: TEST-001
   Building: ctp-red-corp (or any existing building)
   Floor: 10
   Unit Number: 1001
   Size: 100
   Price: 1000
   Status: Available
   Condition: Bare
   ```
3. Click "Save"

### Verify on Website
1. Navigate to the building page: `http://localhost:5173/properties/ctp-red-corp`
2. Go to "Available Units" tab
3. **Expected**: Your new unit appears in the list
4. Click "View Details" on the unit
5. **Expected**: Unit details page shows your data

### Edit Unit Status
1. In admin panel, edit the unit
2. Change status from "Available" to "Occupied"
3. Save changes
4. Refresh the building page on the website
5. **Expected**: Unit no longer shows in "Available Units" (or shows as occupied)

### Delete Unit
1. In admin panel, delete the test unit
2. Refresh the website
3. **Expected**: Unit no longer appears

## 📅 Step 4: Test Appointments

### View Appointments
1. In admin dashboard, click "Appointments"
2. You should see all appointment requests

### Create Test Appointment (from website)
1. On main website, click "Schedule Appointment" in header
2. Fill in the form:
   ```
   Name: Test User
   Email: test@example.com
   Phone: 123-456-7890
   Preferred Date: Tomorrow
   Preferred Time: 10:00 AM
   Message: Test appointment
   ```
3. Submit the form

### Verify in Admin
1. Go back to admin panel > Appointments
2. **Expected**: New appointment appears in the list
3. **Expected**: Status shows as "Pending"

### Update Appointment Status
1. Click on the appointment
2. Change status to "Confirmed"
3. Save
4. **Expected**: Status updates in the list

## 🔄 Step 5: Test Real-time Updates

### Test 1: Building Update
1. Open website in one browser tab
2. Open admin panel in another tab
3. In admin: Edit a building's description
4. In website: Refresh the page
5. **Expected**: Changes appear immediately

### Test 2: Unit Availability
1. Website tab: View a building's available units
2. Admin tab: Change a unit from "Available" to "Occupied"
3. Website tab: Refresh
4. **Expected**: Unit no longer shows as available

### Test 3: New Building
1. Website tab: On homepage
2. Admin tab: Add a new building
3. Website tab: Refresh
4. **Expected**: New building appears in featured listings

## 🔍 Step 6: Verify API Endpoints

### Test API Directly (Optional)

#### Get All Buildings
```bash
curl http://localhost:5000/api/buildings
```
**Expected**: JSON array of all buildings

#### Get Building by ID
```bash
curl http://localhost:5000/api/buildings/ctp-red-corp
```
**Expected**: JSON object with building details

#### Get All Units
```bash
curl http://localhost:5000/api/units
```
**Expected**: JSON array of all available units

#### Get Unit by ID
```bash
curl http://localhost:5000/api/units/CRC-001
```
**Expected**: JSON object with unit details

#### Admin Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
**Expected**: JSON with token

## ✅ Success Criteria

### Admin Panel
- ✅ Login works correctly
- ✅ Dashboard loads with statistics
- ✅ Can view all buildings and units
- ✅ Can create new buildings and units
- ✅ Can edit existing buildings and units
- ✅ Can delete buildings and units
- ✅ Can view and manage appointments
- ✅ Logout works correctly

### Website Integration
- ✅ Homepage displays buildings from database
- ✅ Building pages load data from database
- ✅ Unit listings show current data
- ✅ Changes in admin reflect on website after refresh
- ✅ New buildings/units appear immediately
- ✅ Deleted buildings/units disappear immediately
- ✅ Status changes (available/occupied) update correctly

### API
- ✅ All endpoints respond correctly
- ✅ Authentication works for protected routes
- ✅ CORS allows frontend to access backend
- ✅ Error handling works properly

## 🐛 Troubleshooting

### Issue: Admin login fails
**Solution**: 
- Check backend is running on port 5000
- Verify database connection
- Check admin user exists: `npm run setup:backend`
- Check browser console for errors

### Issue: Changes don't appear on website
**Solution**:
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for API errors
- Verify `VITE_API_URL` in `.env` is correct
- Check backend logs for errors

### Issue: CORS errors
**Solution**:
- Verify backend CORS configuration includes `http://localhost:5173`
- Check backend console for CORS logs
- Restart backend server

### Issue: Images not loading
**Solution**:
- Check image paths in database
- Verify images exist in correct location
- Check browser network tab for 404 errors

## 📊 Database Verification

### Check Buildings Table
```sql
SELECT id, name, display_name FROM buildings;
```

### Check Units Table
```sql
SELECT id, title, building, floor, status FROM units;
```

### Check Appointments Table
```sql
SELECT id, name, email, status, created_at FROM appointments;
```

## 🎯 Expected Flow

```
Admin Panel → Database → API → Website
     ↓           ↓        ↓       ↓
  [Create]   [INSERT]  [GET]  [Display]
  [Update]   [UPDATE]  [GET]  [Refresh]
  [Delete]   [DELETE]  [GET]  [Remove]
```

## ✨ Conclusion

If all tests pass, your admin panel is fully integrated and the website is completely dynamic! Any changes made in the admin panel will immediately reflect on the website after a page refresh.

The system is now:
- ✅ **Dynamic**: All content comes from database
- ✅ **Real-time**: Changes appear immediately
- ✅ **Secure**: Admin routes are protected
- ✅ **Scalable**: Easy to add new buildings/units
- ✅ **Maintainable**: Clean separation of concerns

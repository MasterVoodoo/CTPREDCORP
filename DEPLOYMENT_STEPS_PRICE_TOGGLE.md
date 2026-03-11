# Quick Deployment Steps - Price Toggle Feature

## 1. Database Migration (REQUIRED)

Connect to your MySQL database and run the migration:

```bash
# Option 1: Direct SQL execution
mysql -u ctpredcorp -p ctpredcorp_db < backend/database/migrations/create_settings_table.sql

# Option 2: Via phpMyAdmin or Plesk database manager
# Copy and paste the contents of backend/database/migrations/create_settings_table.sql
```

**Verify the migration:**
```sql
USE ctpredcorp_db;
SHOW TABLES LIKE 'site_settings';
SELECT * FROM site_settings;
```

You should see 3 default settings:
- `show_unit_prices` = true
- `show_contact_info` = true
- `maintenance_mode` = false

## 2. Deploy Code

### For Plesk Deployment:

1. **Push to GitHub:**
   ```bash
   git push origin refactor/clean-architecture
   ```

2. **Pull on Server:**
   - In Plesk, go to Git
   - Click "Pull Updates"
   - Or SSH into server and run:
     ```bash
     cd /var/www/vhosts/ctpred.com.ph/httpdocs
     git pull origin refactor/clean-architecture
     ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Build Frontend:**
   ```bash
   npm run build
   ```

5. **Restart Node.js:**
   - In Plesk: Node.js → Restart App
   - Or via PM2: `pm2 restart all`

## 3. Verify Deployment

### A. Check Database
```sql
SELECT * FROM site_settings;
```

### B. Test API Endpoints
```bash
# Public settings endpoint
curl https://ctpred.com.ph/api/settings

# Should return:
# {"show_unit_prices":true,"show_contact_info":true,"maintenance_mode":false}
```

### C. Test Admin Panel
1. Log in to admin panel: `https://ctpred.com.ph/admin`
2. Click "Site Settings" in sidebar
3. You should see the settings page with toggle switches

### D. Test Price Visibility
1. **With prices enabled (default):**
   - Go to any property page
   - Verify prices are visible on unit cards

2. **Toggle off in admin:**
   - Admin → Site Settings → Toggle "Show Unit Prices" OFF
   - Go to public website (open in incognito)
   - Refresh the page
   - Verify prices are now hidden

3. **Toggle back on:**
   - Admin → Site Settings → Toggle "Show Unit Prices" ON
   - Refresh public website
   - Verify prices are visible again

## 4. Troubleshooting

### Issue: "site_settings table doesn't exist"
**Solution:** Run the migration SQL file again

### Issue: API returns 500 error
**Solution:** 
- Check backend logs: `pm2 logs` or check Plesk logs
- Verify database connection in `.env`
- Restart Node.js application

### Issue: Toggle doesn't work in admin
**Solution:**
- Check browser console for errors
- Verify admin token is valid (try logging out and back in)
- Check that settings route is loaded in `backend/server.js`

### Issue: Prices still showing after disabling
**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check database value: `SELECT setting_value FROM site_settings WHERE setting_key = 'show_unit_prices';`

### Issue: Build fails
**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Run `npm run build`

## 5. Rollback (If Needed)

If something goes wrong, you can rollback:

```bash
# Revert the commit
git revert HEAD

# Or checkout previous commit
git checkout <previous-commit-hash>

# Rebuild
npm install
npm run build

# Restart
pm2 restart all
```

## 6. Post-Deployment Checklist

- [ ] Database migration completed successfully
- [ ] Code deployed to production
- [ ] Dependencies installed
- [ ] Frontend built successfully
- [ ] Backend restarted
- [ ] API endpoint `/api/settings` returns data
- [ ] Admin panel shows "Site Settings" menu
- [ ] Toggle switches work in admin
- [ ] Prices hide/show correctly on public pages
- [ ] No console errors in browser
- [ ] No errors in backend logs

## 7. Next Steps

Once deployed and verified:

1. **Inform stakeholders** that the price visibility feature is live
2. **Document the process** for content managers on how to use the toggle
3. **Monitor logs** for any unexpected errors
4. **Consider adding** the other settings (contact info, maintenance mode) to the admin UI

---

**Need Help?**
- Check `UNIT_PRICE_VISIBILITY_FEATURE.md` for detailed documentation
- Review backend logs: `pm2 logs` or Plesk logs
- Check browser console for frontend errors

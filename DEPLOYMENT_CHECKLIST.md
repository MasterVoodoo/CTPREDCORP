# Deployment Checklist

## Production Deployment Steps

Follow these steps to deploy the fixes to the production server.

### 1. SSH into Production Server
```bash
ssh your_user@ctpred.com.ph
```

### 2. Navigate to Backend Directory
```bash
cd /var/www/vhosts/ctpred.com.ph/httpdocs/backend
```

### 3. Pull Latest Code
```bash
git pull origin main
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Check Environment Variables
```bash
cat .env
```

Verify the .env file contains:
```env
DB_HOST=localhost
DB_USER=ctpredcorp
DB_PASSWORD=ctpredcorp_2026
DB_NAME=ctpredcorp_db
DB_PORT=3306
PORT=5000
NODE_ENV=production
CLIENT_URL=https://ctpred.com.ph
FRONTEND_URL=https://ctpred.com.ph
```

### 6. Restart Passenger
```bash
passenger-config restart-app /var/www/vhosts/ctpred.com.ph/httpdocs/backend
```

### 7. Test API Endpoints
```bash
# Test health endpoint
curl https://ctpred.com.ph/api/health

# Test buildings endpoint (should return array, possibly empty if database is down)
curl https://ctpred.com.ph/api/buildings

# Test units endpoint (should return array, possibly empty if database is down)
curl https://ctpred.com.ph/api/units
```

### 8. Check Server Status
```bash
passenger-status
passenger-memory-stats
```

### 9. Check Logs for Errors
```bash
sudo tail -100 /var/log/apache2/error.log
```

## Fix Summary

The changes we made:

1. **Fixed variable scope issue in server.js**: Declared all route variables in main scope
2. **Updated .htaccess configuration**: Changed to correct PassengerAppRoot and environment
3. **Improved database connection handling**: Started server first, then tested connection
4. **Modified API routes**: Return empty arrays instead of 500 errors when database fails

## Expected Behavior After Deployment

- `/api/health` should return `{"status":"OK","message":"CTP RED API is running","environment":"production","..."}`
- `/api/buildings` should return an empty array `[]` if database is down
- `/api/units` should return an empty array `[]` if database is down
- Frontend should load without 500 errors

## Troubleshooting

If endpoints still fail:
1. Check MySQL is running and credentials are correct
2. Verify database has tables and data
3. Check Node.js version (should be v18 or higher)
4. Review Passenger logs for specific errors
5. Try restarting Apache: `sudo systemctl restart apache2`

# CTP RED Corp Backend API

Node.js + Express + MySQL backend for CTP RED WEBSITE

## Prerequisites

- Node.js (v16 or higher)
- MySQL (via XAMPP or standalone)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=ctpredcorp_db
DB_PORT=3306

PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

### 3. Setup MySQL Database (XAMPP)

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Create Database:**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click "SQL" tab
   - Copy and paste contents from `database/schema.sql`
   - Click "Go" to execute

3. **Seed Initial Data:**
   - In phpMyAdmin, click "SQL" tab again
   - Copy and paste contents from `database/seed.sql`
   - Click "Go" to execute

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Buildings

- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `POST /api/buildings` - Create new building
- `PUT /api/buildings/:id` - Update building
- `DELETE /api/buildings/:id` - Delete building

### Units

- `GET /api/units` - Get all public units (excludes Unavailable)
- `GET /api/units/admin/all` - Get all units including unavailable
- `GET /api/units/:id` - Get unit by ID
- `GET /api/units/building/:buildingId` - Get units by building
- `GET /api/units/status/:status` - Get units by status
- `POST /api/units/search` - Search units with filters
- `POST /api/units` - Create new unit
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

### Financial Data

- `GET /api/financial` - Get all financial data
- `GET /api/financial/year/:year` - Get financial data by year
- `GET /api/financial/year/:year/quarter/:quarter` - Get specific quarter data
- `POST /api/financial` - Create financial data
- `PUT /api/financial/year/:year/quarter/:quarter` - Update financial data
- `DELETE /api/financial/year/:year/quarter/:quarter` - Delete financial data

### Health Check

- `GET /api/health` - Check if API is running
- `GET /` - API information and endpoints

## Testing the API

### Using Browser

Open in browser:
- http://localhost:5000 - API info
- http://localhost:5000/api/health - Health check
- http://localhost:5000/api/buildings - Get all buildings
- http://localhost:5000/api/units - Get all units

### Using cURL

```bash
# Get all buildings
curl http://localhost:5000/api/buildings

# Get building by ID
curl http://localhost:5000/api/buildings/ctp-red-corp

# Search units
curl -X POST http://localhost:5000/api/units/search \
  -H "Content-Type: application/json" \
  -d '{"status":"Available","minSize":1000}'
```

### Using Postman

Import the following collection or create requests manually:

1. GET http://localhost:5000/api/buildings
2. GET http://localhost:5000/api/units
3. POST http://localhost:5000/api/units/search
   - Body (JSON): `{"status": "Available"}`

## Project Structure

```
backend/
├── config/
│   └── database.js       # MySQL connection configuration
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Initial data
├── routes/
│   ├── buildings.js      # Buildings API routes
│   ├── units.js          # Units API routes
│   └── financial.js      # Financial data routes
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Node.js dependencies
├── README.md            # This file
└── server.js            # Main server file
```

## Database Schema

### Tables

1. **buildings** - Building information
2. **building_features** - Building amenities and features
3. **building_floor_plans** - Floor layout data
4. **units** - Office units/spaces
5. **financial_data** - Financial reports and metrics

## Troubleshooting

### Database Connection Error

- Ensure XAMPP MySQL is running
- Check `.env` database credentials
- Verify database exists in phpMyAdmin

### Port Already in Use

Change the PORT in `.env` file:
```env
PORT=5001
```

### CORS Error

Update CLIENT_URL in `.env` to match your frontend URL:
```env
CLIENT_URL=http://localhost:5173
```

## Deployment to Plesk

### 1. Prepare for Production

```bash
npm install --production
```

### 2. Upload Files

- Upload entire `backend/` folder to Plesk
- Exclude `node_modules/` (will install on server)

### 3. Configure Plesk

1. Create Node.js application in Plesk
2. Set application root to `backend/`
3. Set application startup file to `server.js`
4. Install dependencies via Plesk npm interface

### 4. Setup Database on Plesk

1. Create MySQL database in Plesk
2. Import `database/schema.sql` via phpMyAdmin
3. Import `database/seed.sql` for initial data
4. Update `.env` with Plesk database credentials

### 5. Start Application

- Start Node.js application in Plesk control panel
- Application will be available at your domain

## Next Steps

1. Update your React frontend to call these API endpoints
2. Create admin panel for managing data
3. Add authentication/authorization
4. Implement file upload for images
5. Add data validation and error handling

## Support

For issues or questions, check the main repository README or create an issue on GitHub.

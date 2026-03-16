# Database Setup and API Integration Guide

## Overview

Your CTPREDCORP application now uses a **MySQL database** instead of hardcoded TypeScript data files. The architecture consists of:

1. **MySQL Database** - Stores buildings, units, floor plans, and features
2. **Backend API** (Node.js/Express) - Provides REST endpoints to access database
3. **Frontend** (React/Vite) - Fetches data from API and displays it

## Architecture

```
MySQL Database (localhost:3306)
       ↓
Backend API (localhost:3001/api)
       ↓
Frontend React App (localhost:5173)
```

## Database Setup

### 1. Ensure MySQL is Running

Your MySQL database should be running with phpMyAdmin at `http://localhost/phpmyadmin`

### 2. Database Structure

Your database `ctpredcorp_db` should have these tables:

#### Buildings Table
- `id` (PRIMARY KEY) - e.g., "ctp-alpha-tower", "ctp-asean-tower"
- `name` - Internal name
- `display_name` - Public-facing name
- `location` - Full address
- `short_location` - Brief location
- `description` - JSON array of description paragraphs
- `stats` - JSON object with totalFloors, totalUnits, etc.
- `building_hours` - JSON object
- `contact` - JSON object
- `hero_image` - Image path
- `badge` - Building badge text
- `cta_title` - Call-to-action title
- `cta_description` - Call-to-action description

#### Units Table
- `id` (PRIMARY KEY) - e.g., "ASEAN-U1001"
- `title` - Unit name
- `building` - Building ID (FOREIGN KEY)
- `location` - Unit location/address
- `floor` - Floor number
- `size` - Size in sq m
- `capacity` - Person capacity
- `price` - Price per sq m
- `status` - Available/Coming Soon/Taken/Unavailable
- `condition` - Bare/Warm Shell/Fitted
- `image` - Main image path
- `images` - JSON array of image paths
- `description` - Unit description
- `floor_plan` - JSON object
- `availability` - JSON object

## Backend Setup

### 1. Configure Database Connection

Create `backend/.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ctpredcorp_db
DB_PORT=3306
PORT=3001
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start Backend Server

```bash
npm run dev
```

The backend API will run on `http://localhost:3001`

## Frontend Setup

### 1. Configure API URL

Create `.env` file in root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Both Together

Use the concurrent command to run both frontend and backend:

```bash
npm run dev:all
```

## API Endpoints

### Buildings

- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `GET /api/buildings/:id/units` - Get units for a building

### Units

- `GET /api/units` - Get all units (excludes Unavailable)
- `GET /api/units/:id` - Get unit by ID
- `GET /api/units/building/:buildingId` - Get units by building
- `GET /api/units/status/:status` - Get units by status
- `POST /api/units/search` - Search units with filters

## Data Migration

### Important Building ID Mapping

Your database uses different IDs than the old hardcoded files:

**Old (Hardcoded)** → **New (Database)**
- `ctp-red-corp` → `ctp-asean-tower`
- `ctp-alpha-tower` → `ctp-alpha-tower` (same)
- `ctp-bf-building` → `ctp-bf-building` (same)

### Unit ID Formats

**Old Format:** `CRC-1001`, `CAT-GF01`, `CBF-201`
**New Format:** `ASEAN-U1001`, unit IDs from your database

## Components Updated

The following components now fetch from the API:

1. ✅ `AllAvailableSpaces.tsx` - Fetches available units
2. ✅ `Hero.tsx` - Fetches buildings and conditions dynamically
3. ✅ `SearchResults.tsx` - Fetches and filters units

## Testing

### 1. Verify Backend is Running

```bash
curl http://localhost:3001/api/buildings
```

You should see JSON with your buildings

### 2. Verify Frontend API Connection

Open browser console and check for any API errors. The components will now fetch real data from your MySQL database.

### 3. Check Network Tab

In browser DevTools → Network tab, you should see:
- Requests to `http://localhost:3001/api/buildings`
- Requests to `http://localhost:3001/api/units`

## Troubleshooting

### Backend Not Connecting to Database

- Check MySQL is running
- Verify credentials in `backend/.env`
- Check database name is correct

### Frontend Not Fetching Data

- Ensure backend is running on port 3001
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors
- Verify network requests in DevTools

### CORS Issues

The backend should already have CORS configured. If you see CORS errors:

1. Check `backend/server.js` has CORS middleware
2. Ensure frontend origin is allowed

## Next Steps

To complete the migration:

1. ✅ Create `.env` file with `VITE_API_URL=http://localhost:3001/api`
2. ✅ Start backend: `cd backend && npm run dev`
3. ✅ Start frontend: `npm run dev`
4. Test the search and filtering functionality
5. Update remaining components to use API

## Production Deployment

For production:

1. Update `.env.production` with production database credentials
2. Update `VITE_API_URL` to production API URL
3. Ensure image paths in database are correct for production
4. Set up proper CORS for production domain

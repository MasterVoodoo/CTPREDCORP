const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const buildingsRouter = require('./routes/buildings');
const unitsRouter = require('./routes/units');
const financialRouter = require('./routes/financial');
const adminRouter = require('./routes/admin');
const uploadsRouter = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// -------------------- Middleware -------------------- //
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------- Serve Static Assets -------------------- //
// Serve images from src/assets folder
app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));

// -------------------- API Routes -------------------- //
app.use('/api/buildings', buildingsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

// -------------------- Health Check -------------------- //
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CTP RED API is running' });
});

// -------------------- Serve Frontend (Development Only) -------------------- //
// In production (Plesk), frontend is served by Apache from httpdocs
// Backend should ONLY handle /api/* routes
if (!isProduction) {
  // Development: Serve frontend from dist folder
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Catch-all route for client-side routing (development only)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Production: Only serve API routes
  // Return 404 for non-API routes
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Not Found',
      message: 'API endpoint not found. Frontend should be served by Apache.'
    });
  });
}

// -------------------- Error Handling -------------------- //
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// -------------------- Start Server -------------------- //
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 Admin API: http://localhost:${PORT}/api/admin`);
    
    if (isProduction) {
      console.log('✅ Production mode: Backend serving API routes only');
      console.log('ℹ️  Frontend should be served by Apache/Nginx');
    } else {
      console.log('🔧 Development mode: Backend also serving frontend');
    }
  });
};

startServer();

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
const emailRouter = require('./routes/email');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// -------------------- FIXED CORS MIDDLEWARE -------------------- //
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://ctpred.com.ph',
  process.env.FRONTEND_URL || 'https://ctpred.com.ph',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://www.ctpred.com.ph'
].filter(Boolean); // Remove empty values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------- Serve Static Assets -------------------- //
// Serve images from src/assets folder (if exists)
app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));

// -------------------- API Routes (Always Active) -------------------- //
app.use('/api/buildings', buildingsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/appointments', appointmentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/email', emailRouter);

// -------------------- Health Check -------------------- //
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CTP RED API is running',
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// -------------------- Serve Frontend -------------------- //
if (!isProduction) {
  // Development: Serve frontend from dist folder
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Catch-all route for client-side routing (development only)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('🔧 Development mode: Backend also serving frontend from dist/');
} else {
  console.log('✅ Production mode: Backend serving API routes only');
  console.log('ℹ️  Frontend should be served separately (Apache/Nginx)');
}

// -------------------- Error Handling -------------------- //
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Origin:', req.headers.origin);
  console.error('Method:', req.method);
  
  // Send appropriate error response
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// -------------------- 404 Handler (Must be last) -------------------- //
app.use((req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/buildings',
      '/api/units',
      '/api/admin',
      '/api/email/send-appointment',
      '/api/admin/appointments'
    ]
  });
});

// -------------------- Start Server -------------------- //
const startServer = async () => {
  console.log('🔄 Testing database connection...');
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Please check your configuration.');
    console.error('DB_HOST:', process.env.DB_HOST);
    console.error('DB_NAME:', process.env.DB_NAME);
    process.exit(1);
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('🚀 CTP RED Backend Server Started');
    console.log('========================================');
    console.log('📍 Server URL: http://localhost:' + PORT);
    console.log('📝 Environment:', process.env.NODE_ENV || 'development');
    console.log('\n📌 API Endpoints:');
    console.log('   - Health: http://localhost:' + PORT + '/api/health');
    console.log('   - Admin: http://localhost:' + PORT + '/api/admin');
    console.log('   - Email: http://localhost:' + PORT + '/api/email/send-appointment');
    console.log('   - Appointments: http://localhost:' + PORT + '/api/admin/appointments');
    console.log('   - Buildings: http://localhost:' + PORT + '/api/buildings');
    console.log('   - Units: http://localhost:' + PORT + '/api/units');
    console.log('\n🌐 CORS Allowed Origins:');
    allowedOrigins.forEach(origin => console.log('   -', origin));
    console.log('========================================\n');
  });
};

startServer();

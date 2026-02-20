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

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// -------------------- FIXED CORS MIDDLEWARE -------------------- //
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://ctpred.com.ph',
  process.env.FRONTEND_URL || 'https://ctpred.com.ph',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
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

// -------------------- API Routes -------------------- //
app.use('/api/buildings', buildingsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/email', emailRouter);

// -------------------- Health Check -------------------- //
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CTP RED API is running',
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins
  });
});

// -------------------- Serve Frontend (Development Only) -------------------- //
if (!isProduction) {
  // Development: Serve frontend from dist folder
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Catch-all route for client-side routing (development only)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Production: Only serve API routes - 404 everything else
  app.use((req, res) => {
    if (!req.path.startsWith('/api/')) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'API endpoint not found. Frontend should be served by Apache from httpdocs.'
      });
    }
  });
}

// -------------------- Error Handling -------------------- //
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Origin:', req.headers.origin);
  
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
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
  
  app.listen(PORT, () => {
    console.log('🚀 Server running on http://localhost:' + PORT);
    console.log('📝 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔐 Admin API: http://localhost:' + PORT + '/api/admin');
    console.log('📧 Email API: http://localhost:' + PORT + '/api/email');
    console.log('🌐 Allowed CORS origins:', allowedOrigins);
    
    if (isProduction) {
      console.log('✅ Production mode: Backend serving API routes only');
      console.log('ℹ️  Frontend should be served by Apache/Nginx from httpdocs');
    } else {
      console.log('🔧 Development mode: Backend also serving frontend');
    }
  });
};

startServer();

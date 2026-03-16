const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
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


// -------------------- CORS -------------------- //
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://ctpred.com.ph',
  process.env.FRONTEND_URL || 'https://ctpred.com.ph',
  'https://ctpred.com.ph',
  'https://www.ctpred.com.ph',
  'https://ctpredcorp.com.ph',
  'https://www.ctpredcorp.com.ph',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// -------------------- STATIC FILES -------------------- //
const uploadsPath = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath));


// -------------------- API ROUTES -------------------- //
app.use('/api/buildings', buildingsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/appointments', appointmentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/email', emailRouter);


// -------------------- HEALTH CHECK -------------------- //
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CTP RED API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});


// -------------------- DEV FRONTEND SERVING -------------------- //
if (!isProduction) {

  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  console.log('🔧 Development mode: Backend serving frontend');

} else {

  console.log('✅ Production mode: API only');
}


// -------------------- ERROR HANDLER -------------------- //
app.use((err, req, res, next) => {

  console.error('🚨 Server Error:', err);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      origin: req.headers.origin
    });
  }

  res.status(500).json({
    error: 'Server error',
    message: isProduction ? 'Internal server error' : err.message
  });

});


// -------------------- 404 -------------------- //
app.use((req, res) => {

  console.log(`⚠️ 404: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    error: 'Not Found',
    route: req.originalUrl
  });

});


// -------------------- START SERVER -------------------- //
const startServer = async () => {

  console.log('🔄 Testing database connection...');
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('❌ Database connection failed');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {

    console.log('\n========================================');
    console.log('🚀 CTP RED Backend Running');
    console.log('PORT:', PORT);
    console.log('ENV:', process.env.NODE_ENV);
    console.log('Uploads path:', uploadsPath);
    console.log('========================================\n');

  });

};

startServer();
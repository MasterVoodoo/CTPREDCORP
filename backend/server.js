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

// -------------------- Serve Frontend -------------------- //
// Make sure your frontend build is in backend/dist
app.use(express.static(path.join(__dirname, 'dist')));

// For React/Vite frontend routing (catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// -------------------- Error Handling -------------------- //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
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
    console.log(`📝 API Documentation: http://localhost:${PORT}`);
    console.log(`🔐 Admin API: http://localhost:${PORT}/api/admin`);
  });
};

startServer();

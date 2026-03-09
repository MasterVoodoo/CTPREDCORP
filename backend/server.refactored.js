const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
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

const allowedOrigins = [
  process.env.CLIENT_URL || 'https://ctpred.com.ph',
  process.env.FRONTEND_URL || 'https://ctpred.com.ph',
  'https://ctpred.com.ph',
  'https://www.ctpred.com.ph',
  'https://ctpredcorp.com.ph',
  'https://www.ctpredcorp.com.ph',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));

app.use('/api/buildings', buildingsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/appointments', appointmentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/email', emailRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CTP RED API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

if (!isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  logger.info('Development mode: Backend also serving frontend from dist/');
} else {
  logger.info('Production mode: Backend serving API routes only');
}

app.use(errorHandler);
app.use(notFoundHandler);

const startServer = async () => {
  try {
    app.listen(PORT, '0.0.0.0', async () => {
      logger.success('CTP RED Backend Server Started');
      logger.info(`Server URL: http://localhost:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('CORS Allowed Origins:', allowedOrigins);

      try {
        const dbConnected = await testConnection();
        if (dbConnected) {
          logger.success('Database connection successful');
        } else {
          logger.warn('Database connection failed - some features may not work');
        }
      } catch (dbError) {
        logger.error('Database connection error:', dbError.message);
      }
    });
  } catch (error) {
    logger.error('Server startup failed:', error);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();

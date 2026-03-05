// Debug startup script - logs everything to a file we can read
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'startup-debug.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}

log('=== STARTUP DEBUG BEGIN ===');
log(`Node version: ${process.version}`);
log(`Process ID: ${process.pid}`);
log(`Current directory: ${process.cwd()}`);
log(`Script directory: ${__dirname}`);
log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`PORT: ${process.env.PORT}`);

try {
  log('Checking if package.json exists...');
  const packagePath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packagePath)) {
    log('✓ package.json exists');
    const pkg = require('./package.json');
    log(`Package name: ${pkg.name}`);
  } else {
    log('✗ package.json NOT FOUND');
  }
  
  log('Checking if node_modules exists...');
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log('✓ node_modules exists');
    const modules = fs.readdirSync(nodeModulesPath);
    log(`Found ${modules.length} modules`);
    
    // Check for critical modules
    const criticalModules = ['express', 'mysql2', 'cors', 'dotenv'];
    criticalModules.forEach(mod => {
      if (modules.includes(mod)) {
        log(`  ✓ ${mod} installed`);
      } else {
        log(`  ✗ ${mod} MISSING`);
      }
    });
  } else {
    log('✗ node_modules NOT FOUND');
  }
  
  log('Checking if .env exists...');
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    log('✓ .env exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    log(`Found ${lines.length} environment variables`);
    lines.forEach(line => {
      const [key] = line.split('=');
      log(`  - ${key}`);
    });
  } else {
    log('✗ .env NOT FOUND');
  }
  
  log('Attempting to require express...');
  const express = require('express');
  log('✓ Express loaded successfully');
  
  log('Attempting to require mysql2...');
  const mysql = require('mysql2/promise');
  log('✓ MySQL2 loaded successfully');
  
  log('Attempting to load database config...');
  const dbConfig = require('./config/database');
  log('✓ Database config loaded');
  
  log('Attempting to test database connection...');
  const { promisePool } = dbConfig;
  promisePool.query('SELECT 1')
    .then(() => {
      log('✓ Database connection successful');
    })
    .catch(err => {
      log(`✗ Database connection failed: ${err.message}`);
    });
  
  log('Creating simple HTTP server...');
  const http = require('http');
  const PORT = process.env.PORT || 5000;
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', message: 'Debug server running' }));
  });
  
  server.listen(PORT, '0.0.0.0', () => {
    log(`✓ Server listening on port ${PORT}`);
  });
  
  server.on('error', (err) => {
    log(`✗ Server error: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
      log(`Port ${PORT} is already in use`);
    }
    process.exit(1);
  });
  
  log('=== STARTUP DEBUG COMPLETE ===');
  
} catch (error) {
  log(`✗ FATAL ERROR: ${error.message}`);
  log(`Stack trace: ${error.stack}`);
  process.exit(1);
}

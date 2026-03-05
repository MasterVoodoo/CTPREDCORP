// Ultra-simple test server
// This has NO database, NO dependencies, just pure Node.js
// If this doesn't work, the problem is Passenger/Node.js configuration

const http = require('http');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check
  if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'Simple test server is running',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      node_version: process.version,
      env: process.env.NODE_ENV || 'development'
    }));
    return;
  }
  
  // Test buildings endpoint
  if (req.url === '/api/buildings') {
    res.writeHead(200);
    res.end(JSON.stringify([
      {
        id: 'test-building',
        name: 'Test Building',
        displayName: 'Test Building',
        location: 'Test Location',
        description: ['This is a test building from simple server'],
        stats: { floors: 5, units: 100 }
      }
    ]));
    return;
  }
  
  // Test units endpoint
  if (req.url === '/api/units') {
    res.writeHead(200);
    res.end(JSON.stringify([
      {
        id: 1,
        title: 'Test Unit 101',
        building: 'test-building',
        floor: 1,
        size: 500,
        price: 1000,
        status: 'available'
      }
    ]));
    return;
  }
  
  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Not found',
    url: req.url
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Ultra-simple script - just try to write a file
const fs = require('fs');

try {
  // Write to multiple locations to see which works
  const message = 'Ultra-simple script started at ' + new Date().toISOString() + '\n';
  
  // Try writing to backend directory
  fs.writeFileSync(__dirname + '/ultra-simple.log', message);
  
  // Also try console
  console.log('ULTRA SIMPLE: Script is running');
  console.log('ULTRA SIMPLE: __dirname = ' + __dirname);
  console.log('ULTRA SIMPLE: process.cwd() = ' + process.cwd());
  console.log('ULTRA SIMPLE: Node version = ' + process.version);
  
  // Start a simple server
  const http = require('http');
  const port = process.env.PORT || 5000;
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Ultra simple server is running!\n');
  });
  
  server.listen(port, '0.0.0.0', () => {
    const msg = 'Server listening on port ' + port + '\n';
    console.log('ULTRA SIMPLE: ' + msg);
    fs.appendFileSync(__dirname + '/ultra-simple.log', msg);
  });
  
} catch (err) {
  console.error('ULTRA SIMPLE ERROR:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
}

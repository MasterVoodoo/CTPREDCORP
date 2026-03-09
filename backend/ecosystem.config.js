module.exports = {
  apps: [{
    name: 'ctpredcorp-api',
    script: './server.js',
    cwd: '/var/www/vhosts/ctpred.com.ph/httpdocs/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      // Database credentials - UPDATE THESE
      DB_HOST: 'localhost',
      DB_USER: 'your_db_user',
      DB_PASSWORD: 'your_db_password',
      DB_NAME: 'ctpredcorp',
      // JWT Secret - UPDATE THIS
      JWT_SECRET: 'your-super-secret-jwt-key-change-this',
      // URLs
      CLIENT_URL: 'https://ctpred.com.ph',
      FRONTEND_URL: 'https://ctpred.com.ph'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
